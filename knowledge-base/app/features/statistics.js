const P = require('bluebird')

exports.register = (server, options, next) => {

  const sequelize = server.plugins.db.sequelize

  server.route({
    method: 'GET',
    path: '/statistics/applications-by-status',
    config: {
      tags: ['api', 'statistics'],
      handler: (request, reply) => {
        const possibleStatuses = [
          {key: 'APPLYING', display: 'Applying'},
          {key: 'VERIFYING', display: 'Verifying'},
          {key: 'TIMED_OUT', display: 'Timed Out'},
          {key: 'UNDERWRITING', display: 'Underwriting'},
          {key: 'APPROVED', display: 'Approved'},
          {key: 'DECLINED', display: 'Declined'}
        ]
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
          const emptyStatusCount = possibleStatuses.reduce((agg, status) => {
            agg[status.key] = {display: status.display, count: 0}
            return agg
          }, {})

          const fullStatusCount = rows.reduce((agg, val) => {
            agg[val.status].count = val.num_apps
            return agg
          }, emptyStatusCount)

          return fullStatusCount
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
