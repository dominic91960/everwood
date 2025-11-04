import { PrismaClient, ContentType } from '@prisma/client';

const prisma = new PrismaClient();

// Type definitions for content operations
interface CreateContentInput {
  content: string;
  tags?: string[];
  categories?: string[];
  type?: ContentType | string;
  title?: string;
  location?: string;
  time?: string | Date;
  thumbnail?: string;
  mode?: string;
  seoTitle?: string;
  metaDescription?: string;
  metaKeywords?: string[];
}

interface ListContentsInput {
  mode?: string;
  type?: string;
  category?: string;
}

interface UpdateContentInput {
  content?: string;
  tags?: string[];
  categories?: string[];
  type?: ContentType | string;
  title?: string;
  location?: string;
  time?: string | Date;
  thumbnail?: string;
  mode?: string;
  seoTitle?: string;
  metaDescription?: string;
  metaKeywords?: string[];
}

function convertISTToUTC(localTimeString: string): Date {
  // For datetime-local format (YYYY-MM-DDTHH:MM), treat as IST
  const localTime = new Date(localTimeString + ':00');
  // IST is UTC+5:30, so subtract 5.5 hours to get UTC
  const utcTime = new Date(localTime.getTime() - (5.5 * 60 * 60 * 1000));
  return utcTime;
}

function convertUTCToIST(utcDate: Date): Date {
  const istTime = new Date(utcDate.getTime() + (5.5 * 60 * 60 * 1000));
  return istTime;
}

export const ContentService = {
  // Create content
  async createContent({ content, tags, categories, type, title, location, time, thumbnail, mode, seoTitle, metaDescription, metaKeywords }: CreateContentInput) {
    console.log('Creating content with tags:', tags); // Debug log
    // Upsert tags
    const tagObjs = await Promise.all(
      (tags || []).map((name: string) =>
        prisma.tag.upsert({ where: { name }, update: {}, create: { name } })
      )
    );
    console.log('Tag objects created:', tagObjs); // Debug log
    // Upsert categories
    const catObjs = await Promise.all(
      (categories || []).map((name: string) =>
        prisma.categories.upsert({ where: { name }, update: {}, create: { name } })
      )
    );
    let validTime: Date | null = null;
    if (time) {
      if (typeof time === 'string' && /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(time)) {
        validTime = convertISTToUTC(time);
      } else if (time instanceof Date && !isNaN(time.getTime())) {
        validTime = time;
      } else if (typeof time === 'string' && !isNaN(new Date(time).getTime())) {
        validTime = new Date(time);
      }
      // no time error, just null for blogs
    }
    const createdContent = await prisma.content.create({
      data: {
        content,
        type: type as ContentType | null,
        title,
        location,
        time: validTime,
        thumbnail,
        mode,
        seoTitle,
        metaDescription,
        metaKeywords,
      },
    });

    // Create ContentTag and ContentCategory relations
    if (tagObjs.length > 0) {
      try {
        await Promise.all(
          tagObjs.map(tag =>
            prisma.contentTag.create({
              data: {
                contentId: createdContent.id,
                tagId: tag.id,
              },
            })
          )
        );
        console.log(`Created ${tagObjs.length} ContentTag relations for content ${createdContent.id}`); // Debug log
      } catch (error) {
        console.error('Error creating ContentTag relations:', error);
        throw error;
      }
    } else {
      console.log('No tags to create relations for'); // Debug log
    }

    if (catObjs.length > 0) {
      await Promise.all(
        catObjs.map(cat =>
          prisma.contentCategory.create({
            data: {
              contentId: createdContent.id,
              categoryId: cat.id,
            },
          })
        )
      );
    }

    // Return with relations
    const contentWithRelations = await prisma.content.findUnique({
      where: { id: createdContent.id },
      include: {
        tags: { include: { tag: true } },
        categories: { include: { category: true } },
      },
    });

    if (!contentWithRelations) {
      throw new Error('Failed to create content');
    }

    // Return all content data including: title, date (time), description (content), status (mode), and tags
    return {
      id: contentWithRelations.id,
      title: contentWithRelations.title,                    // ✅ TITLE
      time: contentWithRelations.time ? convertUTCToIST(contentWithRelations.time) : null,  // ✅ DATE
      content: contentWithRelations.content,                // ✅ DESCRIPTION (content field)
      mode: contentWithRelations.mode,                      // ✅ STATUS (DRAFT or PUBLISHED)
      tags: contentWithRelations.tags.map(tr => tr.tag.name),  // ✅ TAGS (from Tag collection)
      type: contentWithRelations.type,
      thumbnail: contentWithRelations.thumbnail,
      location: contentWithRelations.location,
      createdAt: contentWithRelations.createdAt,
      seoTitle: contentWithRelations.seoTitle,
      metaDescription: contentWithRelations.metaDescription,
      metaKeywords: contentWithRelations.metaKeywords,
      categories: contentWithRelations.categories.map(cr => cr.category.name),
    };
  },

  // List/filter contents
  async listContents({ mode, type, category }: ListContentsInput) {
    const whereClause = {};
    if (mode) Object.assign(whereClause, { mode });
    if (type && type !== 'ALL') Object.assign(whereClause, { type });
    if (category) Object.assign(whereClause, {
      categories: { some: { category: { name: category } } },
    });
    const contents = await prisma.content.findMany({
      where: whereClause,
      include: {
        tags: { include: { tag: true } },
        categories: { include: { category: true } },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
    // Return all content data including: title, date (time), description (content), status (mode), and tags
    return contents.map(content => ({
      id: content.id,
      title: content.title,                    // ✅ TITLE
      time: content.time ? convertUTCToIST(content.time) : null,  // ✅ DATE
      content: content.content,                // ✅ DESCRIPTION (content field)
      mode: content.mode,                      // ✅ STATUS (DRAFT or PUBLISHED)
      tags: content.tags.map(tr => tr.tag.name),  // ✅ TAGS (from Tag collection)
      type: content.type,
      thumbnail: content.thumbnail,
      location: content.location,
      createdAt: content.createdAt,
      seoTitle: content.seoTitle,
      metaDescription: content.metaDescription,
      metaKeywords: content.metaKeywords,
      categories: content.categories.map(cr => cr.category.name),
    }));
  },

  // Get single content by ID
  async getContentById(id: string) {
    const content = await prisma.content.findUnique({
      where: { id },
      include: {
        tags: { include: { tag: true } },
        categories: { include: { category: true } },
      },
    });
    if (!content) throw new Error('Content not found');
    // Return all content data including: title, date (time), description (content), status (mode), and tags
    return {
      id: content.id,
      title: content.title,                    // ✅ TITLE
      time: content.time ? convertUTCToIST(content.time) : null,  // ✅ DATE
      content: content.content,                // ✅ DESCRIPTION (content field)
      mode: content.mode,                      // ✅ STATUS (DRAFT or PUBLISHED)
      tags: content.tags.map(tr => tr.tag.name),  // ✅ TAGS (from Tag collection)
      type: content.type,
      thumbnail: content.thumbnail,
      location: content.location,
      createdAt: content.createdAt,
      seoTitle: content.seoTitle,
      metaDescription: content.metaDescription,
      metaKeywords: content.metaKeywords,
      categories: content.categories.map(cr => cr.category.name),
    };
  },

  // Update content by ID
  async updateContent(id: string, { content, tags, categories, type, title, location, time, thumbnail, mode, seoTitle, metaDescription, metaKeywords }: UpdateContentInput) {
    // Upsert all tags and categories
    const tagObjs = await Promise.all(
      (tags || []).map((name: string) =>
        prisma.tag.upsert({ where: { name }, update: {}, create: { name } })
      )
    );
    const catObjs = await Promise.all(
      (categories || []).map((name: string) =>
        prisma.categories.upsert({ where: { name }, update: {}, create: { name } })
      )
    );
    let validTime: Date | null = null;
    if (time) {
      if (typeof time === 'string' && /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(time)) {
        validTime = convertISTToUTC(time);
      } else if (time instanceof Date && !isNaN(time.getTime())) {
        validTime = time;
      } else if (typeof time === 'string' && !isNaN(new Date(time).getTime())) {
        validTime = new Date(time);
      }
    }
    // Remove all old tag/category links
    await prisma.contentTag.deleteMany({ where: { contentId: id } });
    await prisma.contentCategory.deleteMany({ where: { contentId: id } });
    
    await prisma.content.update({
      where: { id },
      data: {
        content,
        type: type as ContentType | null,
        title,
        location,
        time: validTime,
        thumbnail,
        mode,
        seoTitle,
        metaDescription,
        metaKeywords,
      },
    });

    // Create ContentTag and ContentCategory relations
    if (tagObjs.length > 0) {
      await Promise.all(
        tagObjs.map(tag =>
          prisma.contentTag.create({
            data: {
              contentId: id,
              tagId: tag.id,
            },
          })
        )
      );
    }

    if (catObjs.length > 0) {
      await Promise.all(
        catObjs.map(cat =>
          prisma.contentCategory.create({
            data: {
              contentId: id,
              categoryId: cat.id,
            },
          })
        )
      );
    }

    // Fetch updated content with relations
    const updatedContent = await prisma.content.findUnique({
      where: { id },
      include: {
        tags: { include: { tag: true } },
        categories: { include: { category: true } },
      },
    });

    if (!updatedContent) {
      throw new Error('Content not found');
    }

    // Return all content data including: title, date (time), description (content), status (mode), and tags
    return {
      id: updatedContent.id,
      title: updatedContent.title,                    // ✅ TITLE
      time: updatedContent.time ? convertUTCToIST(updatedContent.time) : null,  // ✅ DATE
      content: updatedContent.content,                // ✅ DESCRIPTION (content field)
      mode: updatedContent.mode,                      // ✅ STATUS (DRAFT or PUBLISHED)
      tags: updatedContent.tags.map(tr => tr.tag.name),  // ✅ TAGS (from Tag collection)
      type: updatedContent.type,
      thumbnail: updatedContent.thumbnail,
      location: updatedContent.location,
      createdAt: updatedContent.createdAt,
      updatedAt: updatedContent.updatedAt,
      seoTitle: updatedContent.seoTitle,
      metaDescription: updatedContent.metaDescription,
      metaKeywords: updatedContent.metaKeywords,
      categories: updatedContent.categories.map(cr => cr.category.name),
    };
  },

  // Delete content by ID
  async deleteContent(id: string) {
    await prisma.contentTag.deleteMany({ where: { contentId: id } });
    await prisma.contentCategory.deleteMany({ where: { contentId: id } });
    return prisma.content.delete({ where: { id } });
  },
}
