import Aluno from '#models/aluno'
import Curso from '#models/curso'
import { createAluno, updateAluno } from '#validators/aluno'

export default class AlunoService {
  static async listAll() {
    return Aluno.query().preload('curso').preload('disciplinas')
  }

  static async findById(id: number) {
    return Aluno.query().where('id', id).preload('curso').preload('disciplinas').firstOrFail()
  }

  static async create(payload: any) {
    await createAluno.validate(payload) // validação
    return Aluno.create(payload)
  }

  static async update(id: number, payload: any) {
    await updateAluno.validate(payload) // validação
    const aluno = await Aluno.findOrFail(id)
    await aluno.merge(payload).save()
    return aluno
  }

  static async delete(id: number) {
    const aluno = await Aluno.findOrFail(id)
    await aluno.delete()
  }

  static async listCursos() {
    return Curso.all()
  }
}
