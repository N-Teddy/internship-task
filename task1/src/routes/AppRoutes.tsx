import { Routes, Route } from "react-router-dom";
import { Navigate } from 'react-router-dom'
import Login from "@/pages/auth/Login";
import Home from "@/pages/dashboard/Home";
import BasicLayout from "@/layouts/BasicLayout";
import DashboardLayout from "@/layouts/DashboardLayout";
import ProductList from "@/pages/Product/ProductList";
import PostList from "@/pages/Post/PostList";
import ProductDetails from "@/pages/Product/ProductDetails";
import CreatePost from "@/pages/Post/CreatePost";
import CreateProduct from "@/pages/Product/CreateProduct";
import Users from "@/pages/Users";
import PostDetails from "@/pages/Post/PostDetails";
import Carts from "@/pages/Cart";
import Profile from "@/pages/Profile";

// import EditProduct from "@/pages/Product/EditProduct"; // New import

const AppRoutes: React.FC = () => {
    return (
        <Routes>
            {/* DashboardLayout Pages */}
            <Route element={<DashboardLayout />}>
                <Route path="/home" element={<Home />} />

                {/* Product Routes */}
                <Route path="/product-list" element={<ProductList />} />
                <Route path="/product-details/:productName" element={<ProductDetails />} />
                <Route path="/create-product" element={<CreateProduct />} />
                {/* <Route path="/edit-product/:id" element={<EditProduct />} /> New route */}

                {/* Post Routes */}
                <Route path="/post-list" element={<PostList />} />
                <Route path="/create-post" element={<CreatePost />} />
                <Route path="/create-post" element={<CreatePost />} />
                <Route path="/post-details/:id" element={<PostDetails />} />

                {/* Other Routes */}
                <Route path="/users" element={<Users />} />
                <Route path="/cart" element={<Carts />} />
                <Route path="/profile" element={<Profile />} />
            </Route>

            {/* BasicLayout pages */}
            <Route element={<BasicLayout />}>
                <Route path="/" element={<Login />} />
            </Route>

            {/* Catch-all for undefined routes */}
            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    );
};

export default AppRoutes;