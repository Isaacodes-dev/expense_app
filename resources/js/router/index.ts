import {
    createRouter,
    createWebHistory,
    type RouteRecordRaw,
} from 'vue-router';

const routes: RouteRecordRaw[] = [
    {
        path: '/',
        redirect: '/dashboard',
    },
    {
        path: '/login',
        name: 'login',
        component: () => import('@/pages/auth/LoginPage.vue'),
        meta: { layout: 'auth', guest: true },
    },
    {
        path: '/register',
        name: 'register',
        component: () => import('@/pages/auth/RegisterPage.vue'),
        meta: { layout: 'auth', guest: true },
    },
    {
        path: '/dashboard',
        name: 'dashboard',
        component: () => import('@/pages/DashboardPage.vue'),
        meta: { requiresAuth: true },
    },
    {
        path: '/categories',
        name: 'categories',
        component: () => import('@/pages/categories/CategoryListPage.vue'),
        meta: { requiresAuth: true },
    },
    {
        path: '/categories/create',
        name: 'categories.create',
        component: () => import('@/pages/categories/CategoryFormPage.vue'),
        meta: { requiresAuth: true },
    },
    {
        path: '/categories/:id/edit',
        name: 'categories.edit',
        component: () => import('@/pages/categories/CategoryFormPage.vue'),
        meta: { requiresAuth: true },
    },
    {
        path: '/incomes',
        name: 'incomes',
        component: () => import('@/pages/incomes/IncomeListPage.vue'),
        meta: { requiresAuth: true },
    },
    {
        path: '/incomes/create',
        name: 'incomes.create',
        component: () => import('@/pages/incomes/IncomeFormPage.vue'),
        meta: { requiresAuth: true },
    },
    {
        path: '/incomes/:id/edit',
        name: 'incomes.edit',
        component: () => import('@/pages/incomes/IncomeFormPage.vue'),
        meta: { requiresAuth: true },
    },
    {
        path: '/expenses',
        name: 'expenses',
        component: () => import('@/pages/expenses/ExpenseListPage.vue'),
        meta: { requiresAuth: true },
    },
    {
        path: '/expenses/create',
        name: 'expenses.create',
        component: () => import('@/pages/expenses/ExpenseFormPage.vue'),
        meta: { requiresAuth: true },
    },
    {
        path: '/expenses/:id/edit',
        name: 'expenses.edit',
        component: () => import('@/pages/expenses/ExpenseFormPage.vue'),
        meta: { requiresAuth: true },
    },
    {
        path: '/budgets',
        name: 'budgets',
        component: () => import('@/pages/budgets/BudgetListPage.vue'),
        meta: { requiresAuth: true },
    },
    {
        path: '/budgets/create',
        name: 'budgets.create',
        component: () => import('@/pages/budgets/BudgetFormPage.vue'),
        meta: { requiresAuth: true },
    },
    {
        path: '/budgets/:id/edit',
        name: 'budgets.edit',
        component: () => import('@/pages/budgets/BudgetFormPage.vue'),
        meta: { requiresAuth: true },
    },
    {
        path: '/savings',
        name: 'savings-goals',
        component: () => import('@/pages/savings/SavingsGoalListPage.vue'),
        meta: { requiresAuth: true },
    },
    {
        path: '/savings/create',
        name: 'savings-goals.create',
        component: () => import('@/pages/savings/SavingsGoalFormPage.vue'),
        meta: { requiresAuth: true },
    },
    {
        path: '/savings/:id',
        name: 'savings-goals.show',
        component: () =>
            import('@/pages/savings/SavingsGoalDetailPage.vue'),
        meta: { requiresAuth: true },
    },
    {
        path: '/savings/:id/edit',
        name: 'savings-goals.edit',
        component: () => import('@/pages/savings/SavingsGoalFormPage.vue'),
        meta: { requiresAuth: true },
    },
    {
        path: '/:pathMatch(.*)*',
        name: 'not-found',
        component: () => import('@/pages/NotFoundPage.vue'),
    },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

import { setupGuards } from './guards';
setupGuards(router);

export default router;
