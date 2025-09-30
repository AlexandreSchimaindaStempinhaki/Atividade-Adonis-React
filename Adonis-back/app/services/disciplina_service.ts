import Disciplina from '#models/disciplina'
import Curso from '#models/curso'

export interface DisciplinaPayload {
  nome: string
  curso_id: number
  carga?: number
}

export type UpdateDisciplinaPayload = Partial<DisciplinaPayload>

export class DisciplinaService {
  static async list() {
    return Disciplina.query().preload('curso').preload('alunos')
  }
  static async create(data: DisciplinaPayload) {
    return Disciplina.create(data)
  }
  static async findById(id: number) {
    return Disciplina.query().where('id', id).preload('curso').preload('alunos').firstOrFail()
  }
  static async update(id: number, data: UpdateDisciplinaPayload) {
    const disciplina = await Disciplina.findOrFail(id)
    disciplina.merge(data)
    await disciplina.save()
    return disciplina
  }
  static async delete(id: number) {
    const disciplina = await Disciplina.findOrFail(id)
    await disciplina.delete()
  }
  static async cursos() {
    return Curso.all()
  }
}
