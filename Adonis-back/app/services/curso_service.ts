import Curso from '#models/curso'

export default class CursoService {
  static async list() {
    const cursos = await Curso.query().preload('disciplinas').preload('alunos')
    return cursos
  }

  static async get(id: number) {
    const curso = await Curso.query()
      .where('id', id)
      .preload('disciplinas')
      .preload('alunos')
      .firstOrFail()
    return curso
  }

  static async create(payload: any) {
    const curso = await Curso.create({ ...payload })
    return curso
  }

  static async update(id: number, payload: any) {
    const curso = await Curso.findOrFail(id)
    await curso.merge(payload).save()
    return curso
  }

  static async delete(id: number) {
    const curso = await Curso.findOrFail(id)
    await curso.delete()
    return true
  }
}
