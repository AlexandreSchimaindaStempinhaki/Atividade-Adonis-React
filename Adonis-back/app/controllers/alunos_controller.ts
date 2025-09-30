import type { HttpContext } from '@adonisjs/core/http'
import AlunoService from '#services/aluno_service'
import AlunoPolicy from '#policies/aluno_policy'

export default class AlunosController {
  async index({ response, auth, bouncer }: HttpContext) {
    try {
      await auth.getUserOrFail()
      if (await bouncer.with(AlunoPolicy).denies('list')) {
        return response.forbidden({ message: 'Você não tem permissão para listar alunos' })
      }

      const alunos = await AlunoService.listAll()
      return response.status(200).json({ message: 'OK', data: alunos })
    } catch {
      return response.status(500).json({ message: 'ERROR' })
    }
  }

  async show({ params, response, auth, bouncer }: HttpContext) {
    try {
      await auth.getUserOrFail()
      if (await bouncer.with(AlunoPolicy).denies('view')) {
        return response.forbidden({ message: 'Você não tem permissão para ver aluno' })
      }

      const aluno = await AlunoService.findById(params.id)
      return response.status(200).json({ message: 'OK', data: aluno })
    } catch {
      return response.status(500).json({ message: 'ERROR' })
    }
  }

  async create({ response, auth, bouncer }: HttpContext) {
    try {
      await auth.getUserOrFail()
      if (await bouncer.with(AlunoPolicy).denies('create')) {
        return response.forbidden({ message: 'Você não tem permissão para criar aluno' })
      }

      const cursos = await AlunoService.listCursos()
      return response.status(200).json({ message: 'OK', data: cursos })
    } catch {
      return response.status(500).json({ message: 'ERROR' })
    }
  }

  async store({ request, response, auth, bouncer }: HttpContext) {
    try {
      await auth.getUserOrFail()
      if (await bouncer.with(AlunoPolicy).denies('create')) {
        return response.forbidden({ message: 'Você não tem permissão para criar alunos' })
      }

      const aluno = await AlunoService.create(request.all())
      return response.status(201).json({ message: 'OK', data: aluno })
    } catch {
      return response.status(500).json({ message: 'ERROR' })
    }
  }

  async update({ params, request, response, auth, bouncer }: HttpContext) {
    try {
      await auth.getUserOrFail()
      if (await bouncer.with(AlunoPolicy).denies('edit')) {
        return response.forbidden({ message: 'Você não tem permissão para alterar aluno' })
      }

      const aluno = await AlunoService.update(params.id, request.all())
      return response.status(200).json({ message: 'OK', data: aluno })
    } catch {
      return response.status(500).json({ message: 'ERROR' })
    }
  }

  async destroy({ params, response, auth, bouncer }: HttpContext) {
    try {
      await auth.getUserOrFail()
      if (await bouncer.with(AlunoPolicy).denies('delete')) {
        return response.forbidden({ message: 'Você não tem permissão para remover aluno' })
      }

      await AlunoService.delete(params.id)
      return response.status(200).json({ message: 'OK' })
    } catch {
      return response.status(500).json({ message: 'ERROR' })
    }
  }
}
