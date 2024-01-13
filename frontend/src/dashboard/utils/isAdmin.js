const isAdmin = (user) => {
    return ['admin'].includes(user?.role);
  };
  
  export default isAdmin;
  