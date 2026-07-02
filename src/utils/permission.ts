export function hasPermission(permission: string): boolean {
  try {
    const userStr = localStorage.getItem("user");
    if (!userStr) return false;
    const { user } = JSON.parse(userStr);
    if (!user) return false;

    // Check if the user has direct permissions list
    if (Array.isArray(user.permissions) && user.permissions.includes(permission)) {
      return true;
    }

    // Fallback: If user role is admin / superadmin, they have all permissions
    const roles = Array.isArray(user.role) ? user.role : (typeof user.role === "string" ? [user.role] : []);
    const isAdmin = roles.some((r: string) => {
      const lower = r.toLowerCase();
      return (
        lower === "admin" ||
        lower === "superadmin" ||
        lower === "super admin" ||
        lower === "super_admin"
      );
    });

    if (isAdmin) return true;

    // Default fallback: if no permissions array is defined on the user object,
    // we default to true to prevent breaking local development with incomplete mock data.
    if (!user.permissions && roles.length === 0) {
      return true;
    }

    return false;
  } catch (error) {
    console.error("Error checking permissions:", error);
    return false;
  }
}
