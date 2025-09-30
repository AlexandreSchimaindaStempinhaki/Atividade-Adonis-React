import Matricula from '#models/matricula'

export interface MatriculaPayload {
  aluno_id: number
  disciplina_id: number
}

export default class MatriculaService {
  static async list() {
    return Matricula.query().preload('aluno').preload('disciplina')
  }

  static async create(data: MatriculaPayload) {
    return Matricula.create(data)
  }

  static async delete(alunoId: number, disciplinaId: number) {
    const matricula = await Matricula.query()
      .where('aluno_id', alunoId)
      .where('disciplina_id', disciplinaId)
      .firstOrFail()
    await matricula.delete()
  }
}
