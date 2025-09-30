import type { HttpContext } from '@adonisjs/core/http'
import CursoService from '#services/curso_service'
import CursoPolicy from '#policies/curso_policy'
import { createCurso, updateCurso } from '#validators/curso'

export default class CursosController {
  async index({ auth, bouncer, response }: HttpContext) {
    const user = await auth.getUserOrFail()
    if (await bouncer.with(CursoPolicy).denies('list')) {
      return response.forbidden({ message: 'Sem permissão' })
    }

    try {
      const cursos = await CursoService.list()
      return response.ok({ message: 'OK', data: cursos })
    } catch (error) {
      return response.internalServerError({ message: 'ERROR' })
    }
  }

  async show({ params, auth, bouncer, response }: HttpContext) {
    const user = await auth.getUserOrFail()
    if (await bouncer.with(CursoPolicy).denies('view')) {
      return response.forbidden({ message: 'Sem permissão' })
    }

    try {
      const curso = await CursoService.get(params.id)
      return response.ok({ message: 'OK', data: curso })
    } catch (error) {
      return response.internalServerError({ message: 'ERROR' })
    }
  }

  async store({ request, auth, bouncer, response }: HttpContext) {
    const payload = await request.validateUsing(createCurso)
    const user = await auth.getUserOrFail()
    if (await bouncer.with(CursoPolicy).denies('create')) {
      return response.forbidden({ message: 'Sem permissão' })
    }

    try {
      const curso = await CursoService.create(payload)
      return response.created({ message: 'OK', data: curso })
    } catch (error) {
      return response.internalServerError({ message: 'ERROR' })
    }
  }

  async update({ params, request, auth, bouncer, response }: HttpContext) {
    const payload = await request.validateUsing(updateCurso)
    const user = await auth.getUserOrFail()
    if (await bouncer.with(CursoPolicy).denies('edit')) {
      return response.forbidden({ message: 'Sem permissão' })
    }

    try {
      const curso = await CursoService.update(params.id, payload)
      return response.ok({ message: 'OK', data: curso })
    } catch (error) {
      return response.internalServerError({ message: 'ERROR' })
    }
  }

  async destroy({ params, auth, bouncer, response }: HttpContext) {
    const user = await auth.getUserOrFail()
    if (await bouncer.with(CursoPolicy).denies('delete')) {
      return response.forbidden({ message: 'Sem permissão' })
    }

    try {
      await CursoService.delete(params.id)
      return response.ok({ message: 'OK' })
    } catch (error) {
      return response.internalServerError({ message: 'ERROR' })
    }
  }
}
