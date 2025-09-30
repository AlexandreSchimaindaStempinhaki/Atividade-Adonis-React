import type { HttpContext } from '@adonisjs/core/http'
import { createDisciplina, updateDisciplina } from '#validators/disciplina'
import DisciplinaPolicy from '#policies/disciplina_policy'
import { DisciplinaPayload, DisciplinaService } from '#services/disciplina_service'

type UpdateDisciplinaPayload = {
  nome?: string
  curso_id?: number
  carga?: number
}

export default class DisciplinasController {
  /**
   * Display a list of resource
   */
  async index({ auth, bouncer, response }: HttpContext) {
    try {
      // Usuário Autenticado
      const user = auth.getUserOrFail()
      // Verificar se o usuário pode listar posts
      if (await bouncer.with(DisciplinaPolicy).denies('list')) {
        return response.forbidden({ message: 'Você não tem permissão para listar disciplina' })
      }

      // const disciplinas = await Disciplina.all()
      const disciplinas = await DisciplinaService.list()

      return response.status(200).json({
        message: 'OK',
        data: disciplinas,
      })
    } catch (error) {
      return response.status(500).json({
        message: 'ERROR',
      })
    }
  }

  /**
   * Display form to create a new record
   */
  async create({ auth, bouncer, response }: HttpContext) {
    try {
      // Usuário Autenticado
      const user = auth.getUserOrFail()
      // Verificar se o usuário pode listar posts
      if (await bouncer.with(DisciplinaPolicy).denies('create')) {
        return response.forbidden({ message: 'Você não tem permissão para criar disciplina' })
      }

      const cursos = await DisciplinaService.cursos()

      return response.status(200).json({
        message: 'OK',
        data: cursos,
      })
    } catch (error) {
      return response.status(500).json({
        message: 'ERROR',
      })
    }
  }

  /**
   * Handle form submission for the create action
   */
  async store({ request, response, auth, bouncer }: HttpContext) {
    const payload = await request.validateUsing(createDisciplina)
    try {
      // Usuário Autenticado
      const user = auth.getUserOrFail()
      // Verificar se o usuário pode listar posts
      if (await bouncer.with(DisciplinaPolicy).denies('create')) {
        return response.forbidden({ message: 'Você não tem permissão para criar disciplina' })
      }

      const disciplina = await DisciplinaService.create(payload)
      return response.status(201).json({
        message: 'OK',
        data: disciplina,
      })
    } catch (error) {
      return response.status(500).json({
        message: 'ERROR',
      })
    }
  }

  /**
   * Show individual record
   */
  async show({ params, response, auth, bouncer }: HttpContext) {
    try {
      // Usuário Autenticado
      const user = auth.getUserOrFail()
      // Verificar se o usuário pode listar posts
      if (await bouncer.with(DisciplinaPolicy).denies('view')) {
        return response.forbidden({ message: 'Você não tem permissão para ver disciplina' })
      }

      // const disciplina = await Disciplina.findOrFail(params.id)
      const disciplina = await DisciplinaService.findById(params.id)
      return response.status(200).json({ message: 'OK', data: disciplina })
    } catch (error) {
      return response.status(500).json({
        message: 'ERROR',
      })
    }
  }

  /**
   * Edit individual record
   */
  async edit({ params, auth, bouncer, response }: HttpContext) {
    try {
      // Usuário Autenticado
      const user = auth.getUserOrFail()
      // Verificar se o usuário pode listar posts
      if (await bouncer.with(DisciplinaPolicy).denies('edit')) {
        return response.forbidden({ message: 'Você não tem permissão para alterar disciplina' })
      }

      const cursos = await DisciplinaService.cursos()

      return response.status(200).json({
        message: 'OK',
        data: cursos,
      })
    } catch (error) {
      return response.status(500).json({
        message: 'ERROR',
      })
    }
  }

  /**
   * Handle form submission for the edit action
   */
  async update({ params, request, response, auth, bouncer }: HttpContext) {
    const payload: UpdateDisciplinaPayload = await request.validateUsing(updateDisciplina)
    try {
      // Usuário Autenticado
      const user = auth.getUserOrFail()
      // Verificar se o usuário pode listar posts
      if (await bouncer.with(DisciplinaPolicy).denies('edit')) {
        return response.forbidden({ message: 'Você não tem permissão para alterar disciplina' })
      }

      const disciplina = await DisciplinaService.update(params.id, payload)

      return response.status(200).json({
        message: 'OK',
        data: disciplina,
      })
    } catch (error) {
      return response.status(500).json({
        message: 'ERROR',
      })
    }
  }

  /**
   * Delete record
   */
  async destroy({ params, response, auth, bouncer }: HttpContext) {
    try {
      // Usuário Autenticado
      const user = auth.getUserOrFail()
      // Verificar se o usuário pode listar posts
      if (await bouncer.with(DisciplinaPolicy).denies('delete')) {
        return response.forbidden({ message: 'Você não tem permissão para remover disciplina' })
      }

      await DisciplinaService.delete(params.id)

      return response.status(200).json({
        message: 'OK',
      })
    } catch (error) {
      return response.status(500).json({
        message: 'ERROR',
      })
    }
  }
}
