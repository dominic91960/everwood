"use client";

import { useState, useEffect } from "react";
import { DataTable } from "./DataTable";
import { createColumns } from "./columns";
import { FaSearch } from "react-icons/fa";
import AddButton from './AddButton';
import AddCategory from './AddCategory';
import ViewCategory from './VeiwCategory';
import EditCategory from './EditCategory';
import DeleteCategoryModal from './DeleteCategoryModal';
import { categoryApi, Category as ApiCategory } from './api/categoryApi';

// Define Category type to match components
type Category = {
    id: string;
    categoryName: string;
    description: string;
};

const AllProductsTable = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [showAddCategory, setShowAddCategory] = useState(false);
    const [showViewCategory, setShowViewCategory] = useState(false);
    const [showEditCategory, setShowEditCategory] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [deleting, setDeleting] = useState(false);

    // Convert API Category to Component Category format
    const convertApiToComponent = (apiCategory: ApiCategory): Category => ({
        id: apiCategory._id,
        categoryName: apiCategory.name,
        description: apiCategory.description,
    });

    // Convert Component Category to API Category format
    const convertComponentToApi = (componentCategory: Category) => ({
        name: componentCategory.categoryName,
        description: componentCategory.description,
    });

    // Fetch categories from API
    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            setLoading(true);
            const apiData = await categoryApi.getCategories();
            const convertedData = apiData.map(convertApiToComponent);
            setCategories(convertedData);
            setError(null);
        } catch (err: any) {
            setError(err.message || 'Failed to fetch categories');
        } finally {
            setLoading(false);
        }
    };

    // Enhanced filtering logic
    const filteredCategories = categories.filter((category) => {
        // Category name search
        const nameMatches =
            searchTerm === "" ||
            (category.categoryName &&
                category.categoryName
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase()));

        // Description search
        const descriptionMatches =
            searchTerm === "" ||
            (category.description &&
                category.description
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase()));

        return nameMatches || descriptionMatches;
    });

    // Handle adding new category
    const handleCategoryAdded = (newApiCategory: ApiCategory) => {
        const newCategory = convertApiToComponent(newApiCategory);
        setCategories(prev => [newCategory, ...prev]);
    };

    // Handle viewing category
    const handleViewCategory = (category: Category) => {
        setSelectedCategory(category);
        setShowViewCategory(true);
    };

    // Handle editing category
    const handleEditCategory = (category: Category) => {
        setSelectedCategory(category);
        setShowEditCategory(true);
    };

    // Handle updating category
    const handleCategoryUpdated = (updatedCategory: Category) => {
        setCategories(prev => 
            prev.map(cat => 
                cat.id === updatedCategory.id ? updatedCategory : cat
            )
        );
    };

    // Handle delete category
    const handleDeleteCategory = (category: Category) => {
        setSelectedCategory(category);
        setShowDeleteModal(true);
    };

    // Handle confirm delete
    const handleConfirmDelete = async () => {
        if (!selectedCategory) return;
        
        try {
            setDeleting(true);
            await categoryApi.deleteCategory(selectedCategory.id);
            
            // Remove from local state
            setCategories(prev => prev.filter(cat => cat.id !== selectedCategory.id));
            
            // Close modal
            setShowDeleteModal(false);
            setSelectedCategory(null);
        } catch (err: any) {
            console.error('Failed to delete category:', err);
            alert(err.message || 'Failed to delete category');
        } finally {
            setDeleting(false);
        }
    };

    // Create columns with handlers
    const columns = createColumns({
        onViewCategory: handleViewCategory,
        onEditCategory: handleEditCategory,
        onDeleteCategory: handleDeleteCategory,
    });

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-white">Loading categories...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-red-500">Error: {error}</div>
            </div>
        );
    }

    return (
        <div>
            <div className="container mx-auto">
                {/* Category Table with Sorting & Search */}
                <div className="mt-6 rounded-2xl   sm:gap-0">
                    <div className="grid flex-wrap gap-4 sm:mb-6 sm:items-center sm:justify-between sm:gap-2 md:flex">
                        <div>
                            <div className="flex items-center gap-4">
                                <h1 className="text-[28px] font-bold sm:text-[24px] md:text-[26px] lg:text-[28px] xl:text-[30px] text-[#E5E5E5]">
                                    Products
                                </h1>
                                <span className="text-[17px] text-[#E5E5E5] font-semibold sm:text-[18px] md:text-[19px] lg:text-[20px] xl:text-[20px] mt-2">
                                    Category
                                </span>
                            </div>
                        </div>

                        <div className=" grid gap-4 sm:flex flex-wrap mr-[130px]">
                            {/* Search Bar */}
                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder="Search For..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-[220px] rounded-3xl bg-[#0B1739]  px-3 pl-10 py-3 md:w-[250px] lg:w-[280px] xl:w-[285px] 2xl:w-[285px] border-[#FFFFFF33]/20 text-[14px]"
                                />
                                <FaSearch className="absolute top-1/2 left-3 xl:-translate-y-1 -translate-y-1/2 transform text-[#AEB9E1] text-[14px]" />
                            </div>
                            <div className="mt-2">
                                <AddButton 
                                    identifier="addButton" 
                                    buttonText="Add Category" 
                                    onClick={() => setShowAddCategory(true)}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="mt-[10px] sm:mt-0">
                        <DataTable columns={columns} data={filteredCategories} />
                    </div>
                </div>
            </div>

            {/* Add Category Popup */}
            {showAddCategory && (
                <AddCategory
                    onClose={() => setShowAddCategory(false)}
                    onCategoryAdded={handleCategoryAdded}
                />
            )}

            {/* View Category Popup */}
            {showViewCategory && selectedCategory && (
                <ViewCategory
                    onClose={() => setShowViewCategory(false)}
                    category={selectedCategory}
                />
            )}

            {/* Edit Category Popup */}
            {showEditCategory && selectedCategory && (
                <EditCategory
                    onClose={() => setShowEditCategory(false)}
                    category={selectedCategory}
                    onCategoryUpdated={handleCategoryUpdated}
                />
            )}

            {/* Delete Category Modal */}
            <DeleteCategoryModal
                isOpen={showDeleteModal}
                onClose={() => {
                    setShowDeleteModal(false);
                    setSelectedCategory(null);
                }}
                onConfirm={handleConfirmDelete}
                categoryName={selectedCategory?.categoryName || ''}
                isLoading={deleting}
            />
        </div>
    );
};

export default AllProductsTable;
