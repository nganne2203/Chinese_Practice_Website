export type User = {
    id: string;
    userName: string;
    firstName: string | null;
    lastName: string | null;
    birthDate: string | null;
    email: string | null;
    roles: Array<{
        name: string;
        description: string;
        permissions: Array<{
            name: string;
            description: string;
        }>;
    }>;
    createdAt: string;
    updatedAt: string;
}