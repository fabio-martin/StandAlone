/**
 * Constructor function that initializes a new User instance with the given arguments.
 * @param    {string} username - The user identifier.
 * @param    {string} password - The user password. (TODO: This is wrong)
 * @param    {string} name - The user name
 * @param    {string} name - The user name
 * @param    {string} gravatar - The link for the user's gravatar image.
 * @param    {string} email - The user's email.
 * @param    {string} profule - The user's profile, could be { client, admin}.
 * @class
 * @classdesc Data type that represents the user information.
 * @api public
 */
function User (username, password, name, gravatar, email, profile) {
    if (!(this instanceof User)) return { username, password, name, gravatar, email, profile }
    this.username = username
    this.password = password
    this.name = name
    this.gravatar = gravatar
    this.email = email
    this.profile = profile
  }
  