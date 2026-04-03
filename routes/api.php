<?php

use App\Http\Controllers\Api\AuthController;
use Illuminate\Support\Facades\Route;

Route::middleware('throttle:6,1')->group(function () {
    Route::post('register', [AuthController::class, 'register']);
    Route::post('login', [AuthController::class, 'login']);
});

Route::middleware(['auth:sanctum', 'throttle:60,1'])->group(function () {
    Route::post('logout', [AuthController::class, 'logout']);
    Route::get('user', [AuthController::class, 'user']);

    Route::get('dashboard', \App\Http\Controllers\Api\DashboardController::class);

    Route::apiResource('categories', \App\Http\Controllers\Api\CategoryController::class);
    Route::apiResource('incomes', \App\Http\Controllers\Api\IncomeController::class);
    Route::apiResource('expenses', \App\Http\Controllers\Api\ExpenseController::class);
    Route::apiResource('budgets', \App\Http\Controllers\Api\BudgetController::class);
    Route::apiResource('savings-goals', \App\Http\Controllers\Api\SavingsGoalController::class);
    Route::apiResource('savings-goals.contributions', \App\Http\Controllers\Api\SavingsContributionController::class)
        ->scoped();
});
