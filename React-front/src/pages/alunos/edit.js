import { useNavigate } from 'react-router';
import { useLocation } from 'react-router-dom';
import { useState, useEffect, useContext } from 'react';
import { Container, Modal, Button } from 'react-bootstrap';
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

export default function Edit() {

    const location = useLocation();
    const aluno = location.state?.item;

    const [name, setName] = useState(aluno.nome)
    const [courses, setCourses] = useState([])
    const [courseId, setCourseId] = useState('')
    const [show, setShow] = useState(false);
    const navigate = useNavigate();
    // const { user } = useContext(UserContext);
    const permissions = getPermissions()
    const dataUser  = getDataUser()

    function updateAluno() {

        const upAluno = { nome: name, curso_id: courseId }
        
        Client.put("alunos/" + aluno.id, upAluno).then(response => {
            setShow(true);
        })
        .catch(error => {
            console.error(error);
        });
    }

    const handleClose = () => {
        setShow(false)
        navigate('/alunos')
    }

    function verifyPermission() {
        // Não Autenticado   
        if(!dataUser) navigate('/login')
        // Não Autorizado (rota anterior)
        else if(permissions.editAluno === 0) navigate(-1)
    }

    useEffect(() => {
        verifyPermission()
    }, []);

    useEffect(() => {
        Client.get('cursos')
            .then(res => {
                const cursos = res.data.data
                setCourses(cursos)

                if(aluno?.curso?.id) {
                    setCourseId(String(aluno.curso.id))
                }
            })
            .catch(err => console.log(err))
    }, [aluno])

    useEffect(() => {
        
    }, [aluno])

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
                    <option key={c.id} value={String(c.id)}>
                        {c.nome}
                    </option>
                ))}
                </Select>
                <Submit value="Voltar" onClick={() => navigate('/alunos')  }/>
                <Submit value="Alterar" onClick={() => updateAluno() }/>
            </Container>
            <Modal
                show={show}
                onHide={handleClose}
                backdrop="static"
                keyboard={false}
            >
                <Modal.Header closeButton>
                    <Modal.Title>Atualização - Usuário</Modal.Title>
                </Modal.Header>
                <Modal.Body>Operação Efetuda com Sucesso!!</Modal.Body>
                <Modal.Footer>
                    <Button variant="primary" onClick={handleClose}>OK</Button>
                </Modal.Footer>
            </Modal>
        </>
    )
    
}