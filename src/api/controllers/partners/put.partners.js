const errorHandler = require('../../utils/errorHandler')
const { check } = require('express-validator/check')
const validateBody = require('../../middlewares/validateBody')
const log = require('../../utils/log')(module)
const isAuth = require('../../middlewares/isAuth')
const isAdmin = require('../../middlewares/isAdmin')
const path = require('path')
const fs = require('fs')

module.exports = app => {
  app.put('/partners/:id', [
    check('name')
      .isString()
      .exists(),
    check('url')
      .exists()
      .isString(),
    check('description')
      .optional()
      .isString(),
    check('image')
      .exists()
      .isString(),
    check('visible')
      .optional()
      .isBoolean(),
    validateBody()
  ])
  app.put('/partners/:id', [
    isAuth('partners-modify'),
    isAdmin('partners-modify')
  ])
  app.put('/partners/:id', async (req, res) => {
    const { Partner } = app.locals.models
    try {
      let partner = await Partner.findByPk(req.params.id)
      const files = fs.readdirSync(path.join(__dirname, '../../../../temp'))
      let file = files.find(f => f.indexOf(req.body.image) !== -1)
      if (file) {
        fs.unlinkSync(path.join(__dirname, '../../../..', partner.image))
        const oldfile = path.join(__dirname, '../../../../temp', file)
        const newfile = path.join(__dirname, '../../../../images', file)
        fs.copyFileSync(oldfile, newfile)
        fs.unlinkSync(oldfile)
        await partner.update({ ...req.body, image: '/images/' + file })
      } else {
        await partner.update(req.body)
      }
      const partners = await Partner.findAll({ where: { visible: 1 } })
      app.locals.io.emit('partners', partners)

      log.info(`Partner ${partner.name} modified`)
      return res
        .status(200)
        .json(partner)
    } catch (err) {
      errorHandler(err, res)
    }
  })
}
