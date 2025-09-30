import { useNavigate } from 'react-router';
import { useState, useEffect, useContext } from 'react';
import { Container } from 'react-bootstrap';
import NavigationBar from '../../components/navigationbar';
import { 
    Label,
    Input,
    Submit,
    Select,
} from "./style"
import { Client } from '../../api/client';
// import UserContext from '../../contexts/UserContext'
import { getPermissions } from '../../service/PermissionService';
import { getDataUser } from '../../service/UserService';

export default function Create() {

    const [name, setName] = useState('')
    const [students, setStudents] = useState([])
    const [studentId, setStudentId] = useState('')
    const [disciplines, setDisciplines] = useState([])
    const [disciplineId, setDisciplineId] = useState('')
    const navigate = useNavigate();
    // const { user } = useContext(UserContext);
    const permissions = getPermissions()
    const dataUser  = getDataUser()
    
    function sendData() {

        const user = { aluno_id: studentId, disciplina_id: disciplineId }
        // console.log(user)

        Client.post('matriculas', user).then(response => {
            console.log(response.data);
        })
        .catch(error => {
            console.error(error);
        });

        navigate('/matriculas')
    }

    function verifyPermission() {
       // Não Autenticado   
        if(!dataUser) navigate('/login')
        // Não Autorizado (rota anterior)
        else if(permissions.createMatricula === 0) navigate(-1)
    }
    
    useEffect(() => {
        verifyPermission()
    }, []);

    useEffect(() => {
        Client.get('alunos')
            .then(res => {
                const alunos = res.data.data
                setStudents(alunos)
                if(alunos.length > 0) setStudentId(alunos[0].id)
            })
        Client.get('disciplinas')
            .then(res => {
                const disciplinas = res.data.data
                setDisciplines(disciplinas)
                if(disciplinas.length > 0) setDisciplineId(disciplinas[0].id) 
            })
            
            .catch(err => console.log(err))
    }, [])

    return (
        <>
            <NavigationBar />
             <Container className='mt-2'>
                <Label>Aluno</Label>
                 <Select
                    name="student" 
                    id="student" 
                    value={studentId} 
                    onChange={(e) => setStudentId(e.target.value)}
                >
                {students.map((c) => (
                    <option key={c.id} value={c.id}>
                        {c.nome}
                    </option>
                ))}
                </Select>

                <Label>Disciplina</Label>
                 <Select
                    name="discipline" 
                    id="discipline" 
                    value={disciplineId} 
                    onChange={(e) => setDisciplineId(e.target.value)}
                >
                {disciplines.map((c) => (
                    <option key={c.id} value={c.id}>
                        {c.nome}
                    </option>
                ))}
                </Select>
                <Submit value="Voltar" onClick={() => navigate('/matriculas')  }/>
                <Submit value="Cadastrar" onClick={() => sendData() }/>
             </Container>
        </>
    )
    
}