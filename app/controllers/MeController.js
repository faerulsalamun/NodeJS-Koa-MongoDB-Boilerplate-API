/**
 * Created by faerulsalamun on 7/31/17.
 */

'use strict';

// Models
const User = require(`../models/User`);

module.exports = {

  /**
   *
   * @api {get} /me My Profile
   * @apiName My Profile
   * @apiGroup Me
   * @apiVersion  0.0.1
   * @apiPermission User, Admin
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
            "_id": "597e80689a62c822d76a07b6",
            "createdTime": "2017-07-30T22:02:16.000Z",
            "updatedTime": "2017-07-30T22:02:16.000Z",
            "email": "faerulsalamun@five-code.com",
            "username": "faerulsalamun",
            "__v": 0,
            "role": [
                "user"
            ],
            "state": "verified"
        }
      }
   *
   *
   */
  show: async(ctx, next) => {
    ctx.res.ok(ctx.req.user);
  },

};
