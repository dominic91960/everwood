'use client'
import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import api from '@/lib/api'

interface Blog {
    id: string;
    title: string;
    content: string;
    thumbnail: string;
    time: string | null;
    tags: string[];
    mode: string;
}

interface BlogProps {
    selectedCategory?: string;
}

function blog({ selectedCategory = 'All' }: BlogProps) {
    const [blogs, setBlogs] = useState<Blog[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchBlogs = async () => {
            try {
                setLoading(true);
                setError(null);
                
                // Fetch only published blogs
                const response = await api.content.list({ 
                    type: 'BLOG',
                    mode: 'PUBLISHED'
                });

                setBlogs(response);
            } catch (err) {
                console.error('Failed to fetch blogs:', err);
                setError(err instanceof Error ? err.message : 'Failed to fetch blogs');
            } finally {
                setLoading(false);
            }
        };

        fetchBlogs();
    }, []);

    // Helper function to extract text from HTML content
    const getDescription = (htmlContent: string) => {
        if (!htmlContent) return '';
        // Remove HTML tags and decode entities
        const text = htmlContent.replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ').trim();
        return text.substring(0, 150) + (text.length > 150 ? '...' : '');
    };

    // Format date
    const formatDate = (dateString: string | null) => {
        if (!dateString) return '';
        try {
            const date = new Date(dateString);
            return date.toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'short', 
                day: 'numeric' 
            });
        } catch {
            return '';
        }
    };

    if (loading) {
        return (
            <div className='margin-y'>
                <div className='subtitle pb-8'>
                    Our Blogs
                </div>
                <div className='flex justify-center items-center py-12'>
                    <p className='text-gray-500'>Loading blogs...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className='margin-y'>
                <div className='subtitle pb-8'>
                    Our Blogs
                </div>
                <div className='flex justify-center items-center py-12'>
                    <p className='text-red-500'>Error: {error}</p>
                </div>
            </div>
        );
    }

    // Filter blogs based on selected category
    const filteredBlogs = blogs.filter((blog) => {
        if (selectedCategory === 'All') {
            return true;
        }
        // Check if blog has the selected tag
        return blog.tags && blog.tags.some(tag => tag === selectedCategory);
    });

    if (blogs.length === 0) {
        return (
            <div className='margin-y'>
                <div className='subtitle pb-8'>
                    Our Blogs
                </div>
                <div className='flex justify-center items-center py-12'>
                    <p className='text-gray-500'>No blogs available yet.</p>
                </div>
            </div>
        );
    }

    if (filteredBlogs.length === 0) {
        return (
            <div className='margin-y'>
                <div className='subtitle pb-8'>
                    Our Blogs
                </div>
                <div className='flex justify-center items-center py-12'>
                    <p className='text-gray-500'>No blogs found in this category.</p>
                </div>
            </div>
        );
    }

    return (
        <div className='margin-y'>
            <div>
                <div className='subtitle pb-8'>
                    Our Blogs
                </div>
                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
                    {filteredBlogs.map((blog) => (
                        <div key={blog.id} className='rounded-2xl overflow-hidden'>
                            <div className='relative'>
                                <Image 
                                    src={blog.thumbnail || '/image/Blog/Blog1.png'} 
                                    alt={blog.title} 
                                    className="w-full h-64 object-cover" 
                                    width={400}
                                    height={256}
                                />
                                {blog.tags && blog.tags.length > 0 && (
                                    <div className='absolute top-4 left-4'>
                                        <span className='bg-white text-button px-4 py-2 rounded-full text-sm font-medium'>
                                            {blog.tags[0]}
                                        </span>
                                    </div>
                                )}
                            </div>
                            <div className='p-2'>
                                <h3 className='text-2xl font-bold text-black mb-3'>
                                    {blog.title}
                                </h3>
                                <p className='text-gray-500 description mb-2 line-clamp-3'>
                                    {getDescription(blog.content)}
                                </p>
                                <p className='text-gray-400 text-sm'>
                                    {formatDate(blog.time)}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
           
        </div>
    )
}

export default blog