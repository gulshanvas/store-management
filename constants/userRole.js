class UserRole {

  get manager() {
    return 'MANAGER';
  }

  get admin() {
    return 'ADMIN';
  }

}

module.exports = new UserRole();