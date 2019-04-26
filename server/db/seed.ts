import { prisma } from '../src/generated/prisma-client'

async function main() {
  const setMenu = async (name: string, parent: Promise<string> | undefined = undefined): Promise<string> => prisma.createMenu({
    menu: parent
      ? {
          connect: {
            id: await parent
          }
        }
      : undefined,
    name,
  }).id()

  const setConnectArray = async (arr: Array<Promise<string>>) => ({
    connect: (await Promise.all(arr)).map(id => ({ id }))
  })

  const setStep = async (question: string, target: Promise<string>, path: Array<Promise<string>>) => prisma.createStep({
    target: {
      connect: {
        id: await target
      }
    },
    question,
    path: (await setConnectArray(path))
  }).id()


  


  const levelOne = [
    setMenu('Persona'),
    setMenu('Principal'),
    setMenu('Secundário'),
  ]
  const [
    persona,
    principal,
    secundario
  ] = levelOne


  const levelTwo = [
    setMenu('Alunos', persona),
    setMenu('Professores', persona),
    setMenu('A universidade', principal),
    setMenu('Ensino', principal),
    setMenu('Eventos', secundario),
    setMenu('Noticias', secundario), 
  ]
  const [
    personaAluno,
    personaProfessores,
    principalAUniversidade,
    principalEnsino,
    secundarioEventos,
    secundarioNoticias
  ] = levelTwo


  const menus = [
    ...levelOne,
    ...levelTwo
  ]
  const menusConnect = setConnectArray(menus)


  const steps = [
    setStep(
      "Encontre serviços e informações para alunos",
      personaAluno,
      [personaAluno]
    ),
    setStep(
      "Encontre serviços e informações para professores",
      personaProfessores,
      [personaProfessores]
    ),
    setStep(
      "Encontre informações sobre a universidade",
      principalAUniversidade,
      [principalAUniversidade]
    ),
    setStep(
      "Encontre informações sobre ensino",
      principalEnsino,
      [principalEnsino]
    ),
    setStep(
      "Encontre eventos na ufrj",
      secundarioEventos,
      [secundarioEventos]
    ),
    setStep(
      "Encontre noticias sobre a ufrj",
      secundarioNoticias,
      [secundarioNoticias]
    )
  ]
  const stepsConnect = setConnectArray(steps)


  const commons = {
    menus: (await menusConnect),
    steps: (await stepsConnect)
  }

  await prisma.createView({
    ...commons,
    company: {
      create: {
        name: 'Universidade Federal do Rio de Janeiro',
        abbr: 'UFRJ'
      }
    },
    welcome: {
      create: {
        title: 'Bem-vindo!',
        message: '<p>Olá! Estamos criando o futuro, participe do teste e nos ajude a fazer da UFRJ um lugar melhor! =]</p>'
      }
    },
    tests: {
      create: [
        {
          ...commons,
          title: 'Teste de navegação do novo portal',
        }
      ]
    }
  }).id()
}

main().catch(e => console.error(e))
