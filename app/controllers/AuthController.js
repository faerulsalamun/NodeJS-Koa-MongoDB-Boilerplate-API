/**
 * Created by faerulsalamun on 7/31/17.
 */

'use strict';

// Models
const User = require(`../models/User`);

module.exports = {

  /**
   * @api {post} /register Register user
   * @apiName Register
   * @apiGroup Auth
   * @apiVersion  0.0.1
   * @apiPermission User, Admin
   *
   * @apiParam {String} email email of the User.
   * @apiParam {String} username username of the User.
   * @apiParam {String} password password of the User.
   * @apiParam {String} passwordConfirmation passwordConfirmation of the User.
   *
   * @apiSuccess (200) {String} _id user
   * @apiSuccess (200) {String} createdTime user
   * @apiSuccess (200) {String} updatedTime user
   * @apiSuccess (200) {String} email user
   * @apiSuccess (200) {String} username user
   * @apiSuccess (200) {Integer} __v user
   * @apiSuccess (200) {Array} role user
   * @apiSuccess (200) {String} verified user
   *
   * @apiSuccessExample {type} Success-Response:
     {
      "meta": {
          "code": 200,
          "status": true,
          "messages": "Ok"
      },
      "data": {
          "__v": 0,
          "createdTime": "2017-07-31T00:57:12.000Z",
          "updatedTime": "2017-07-31T00:57:12.000Z",
          "email": "faerulsalamun@five-code.com",
          "username": "faerulsalamun",
          "_id": "597e80689a62c822d76a07b6",
          "role": [
              "user"
          ],
          "state": "init"
      }
    }
   */
  register: async(ctx, next) => {
    const user = new User({
      email: ctx.request.body.email,
      username: ctx.request.body.username,
      password: ctx.request.body.password,
      passwordConfirmation: ctx.request.body.passwordConfirmation,
    });

    const saveUser = await user.save();

    ctx.res.ok(saveUser);
  },
};
