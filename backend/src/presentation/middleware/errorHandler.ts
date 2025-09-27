import { GraphQLError } from 'graphql'
import { ZodError } from 'zod'

export function formatError(error: any): GraphQLError {
    if (error.originalError instanceof ZodError) {
        const zodError = error.originalError as ZodError
        const message = zodError.issues
            .map((issue) => `${issue.path.join('.')}: ${issue.message}`)
            .join(', ')

        return new GraphQLError(`Validation error: ${message}`, {
            extensions: {
                code: 'VALIDATION_ERROR',
                details: zodError.issues,
            },
        })
    }

    if (error.message.includes('fetch')) {
        return new GraphQLError('Failed to fetch data from external service', {
            extensions: {
                code: 'EXTERNAL_SERVICE_ERROR',
            },
        })
    }

    if (
        error.message.includes('SQLITE') ||
        error.message.includes('database')
    ) {
        console.error('Database error:', error)
        return new GraphQLError('Internal database error', {
            extensions: {
                code: 'DATABASE_ERROR',
            },
        })
    }

    console.error('GraphQL Error:', error)

    return new GraphQLError('An unexpected error occurred', {
        extensions: {
            code: 'INTERNAL_ERROR',
        },
    })
}
