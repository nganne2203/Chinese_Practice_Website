import type { User } from '../types/User';

export const hasRole = (user: User | null, roleName: string): boolean => {
    if (!user || !user.roles) {
        return false;
    }

    return user.roles.some((role) => role.name === roleName);
};

export const hasAnyRole = (user: User | null, roleNames: string[]): boolean => {
    if (!user || !user.roles) {
        return false;
    }

    return user.roles.some((role) => roleNames.includes(role.name));
};

export const hasAllRoles = (user: User | null, roleNames: string[]): boolean => {
    if (!user || !user.roles) {
        return false;
    }

    return roleNames.every((roleName) =>
        user.roles.some((role) => role.name === roleName)
    );
};

export const hasPermission = (user: User | null, permissionName: string): boolean => {
    if (!user || !user.roles) {
        return false;
    }

    return user.roles.some((role) =>
        role.permissions?.some((permission) => permission.name === permissionName)
    );
};

export const isAdmin = (user: User | null): boolean => {
    if (!user || !user.roles) {
        return false;
    }

    return user.roles.some((role) => {
        const roleName = role.name.toUpperCase();
        return roleName === 'ADMIN' || roleName === 'ROLE_ADMIN';
    });
};

export const getUserRoles = (user: User | null): string[] => {
    if (!user || !user.roles) {
        return [];
    }

    return user.roles.map((role) => role.name);
};

export const getUserPermissions = (user: User | null): string[] => {
    if (!user || !user.roles) {
        return [];
    }

    const permissions = new Set<string>();

    user.roles.forEach((role) => {
        role.permissions?.forEach((permission) => {
            permissions.add(permission.name);
        });
    });

    return Array.from(permissions);
};
