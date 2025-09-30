import type { HttpContext } from '@adonisjs/core/http'
import MatriculaService from '#services/matricula_service'
import MatriculaPolicy from '#policies/matricula_policy'
import { createMatricula } from '#validators/matricula'

export default class MatriculasController {
  async index({ response, auth, bouncer }: HttpContext) {
    await auth.getUserOrFail()
    if (await bouncer.with(MatriculaPolicy).denies('list')) {
      return response.forbidden({ message: 'Sem permissão' })
    }
    const data = await MatriculaService.list()
    return response.status(200).json({ message: 'OK', data })
  }

  async store({ request, response, auth, bouncer }: HttpContext) {
    await auth.getUserOrFail()
    if (await bouncer.with(MatriculaPolicy).denies('create')) {
      return response.forbidden({ message: 'Sem permissão' })
    }
    const payload = await request.validateUsing(createMatricula)
    const data = await MatriculaService.create(payload)
    return response.status(201).json({ message: 'OK', data })
  }

  async destroy({ params, response, auth, bouncer }: HttpContext) {
    await auth.getUserOrFail()
    if (await bouncer.with(MatriculaPolicy).denies('delete')) {
      return response.forbidden({ message: 'Sem permissão' })
    }
    await MatriculaService.delete(params.alunoId, params.disciplinaId)
    return response.status(200).json({ message: 'OK' })
  }
}
