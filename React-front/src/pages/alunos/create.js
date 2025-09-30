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
    const [courses, setCourses] = useState([])
    const [courseId, setCourseId] = useState('')
    const navigate = useNavigate();
    // const { user } = useContext(UserContext);
    const permissions = getPermissions()
    const dataUser  = getDataUser()
    
    function sendData() {

        const user = { nome: name, curso_id: courseId }
        // console.log(user)

        Client.post('alunos', user).then(response => {
            console.log(response.data);
        })
        .catch(error => {
            console.error(error);
        });

        navigate('/alunos')
    }

    function verifyPermission() {
       // Não Autenticado   
        if(!dataUser) navigate('/login')
        // Não Autorizado (rota anterior)
        else if(permissions.createAluno === 0) navigate(-1)
    }
    
    useEffect(() => {
        verifyPermission()
    }, []);

    useEffect(() => {
        Client.get('cursos')
            .then(res => {
                const cursos = res.data.data
                setCourses(cursos)
                if(cursos.length > 0) setCourseId(cursos[0].id)
            })
            .catch(err => console.log(err))
    }, [])

    return (
        <>
            <NavigationBar />
             <Container className='mt-2'>
                <Label>Nome</Label>
                 <Input
                    type="text" 
                    id="name" 
                    name="name" 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
                <Label>Curso</Label>
                 <Select
                    name="course" 
                    id="course" 
                    value={courseId} 
                    onChange={(e) => setCourseId(e.target.value)}
                >
                {courses.map((c) => (
                    <option key={c.id} value={c.id}>
                        {c.nome}
                    </option>
                ))}
                </Select>
                <Submit value="Voltar" onClick={() => navigate('/alunos')  }/>
                <Submit value="Cadastrar" onClick={() => sendData() }/>
             </Container>
        </>
    )
    
}