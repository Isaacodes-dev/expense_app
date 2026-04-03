<?php

namespace App\Models;

use App\Models\Concerns\BelongsToUser;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Income extends Model
{
    use BelongsToUser, HasFactory;

    protected $fillable = [
        'user_id',
        'date',
        'source',
        'amount',
        'notes',
    ];

    protected $casts = [
        'date' => 'date',
        'amount' => 'decimal:2',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function scopeForMonth(Builder $query, int $month, int $year): Builder
    {
        return $query->whereMonth('date', $month)->whereYear('date', $year);
    }

    public function scopeDateRange(Builder $query, ?string $from, ?string $to): Builder
    {
        return $query->when($from, fn ($q) => $q->where('date', '>=', $from))
                     ->when($to, fn ($q) => $q->where('date', '<=', $to));
    }
}
