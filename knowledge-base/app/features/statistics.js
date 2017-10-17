const P = require('bluebird')

exports.register = (server, options, next) => {

  const sequelize = server.plugins.db.sequelize

  server.route({
    method: 'GET',
    path: '/statistics/applications-by-status',
    config: {
      tags: ['api', 'statistics'],
      handler: (request, reply) => {
        sequelize.query(
          `
          SELECT
            b.status,
            COALESCE(COUNT(*), 0) as num_apps
          FROM
            applications a
              RIGHT OUTER JOIN
            (SELECT DISTINCT status FROM applications) b
              ON a.status = b.status
          WHERE
            deleted_at IS NULL
          GROUP BY
            b.status
          `
        )
        .spread(rows => {
          return rows.reduce((agg, val) => {
            agg[val.status] = val.num_apps
            return agg
          }, {})
        })
        .asCallback(reply)
      }
    }
  })

  next()
}

exports.register.attributes = {
  name: 'statistics',
  version: '1.0.0'
}
