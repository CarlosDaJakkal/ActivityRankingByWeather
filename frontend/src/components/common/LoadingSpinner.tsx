export function LoadingSpinner({
    className = 'h-8 w-8',
}: {
    className?: string
}) {
    return (
        <div
            className={`animate-spin rounded-full border-b-2 border-primary-500 ${className}`}
        />
    )
}
