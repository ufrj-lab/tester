import { prisma } from '../src/generated/prisma-client'

async function main() {
   const setMenu = async (
      name: string,
      parent: Promise<string> | undefined = undefined,
   ): Promise<string> =>
      prisma
         .createMenu({
            menu: parent
               ? {
                    connect: {
                       id: await parent,
                    },
                 }
               : undefined,
            name,
         })
         .id()

   const setConnectArray = async (arr: Array<Promise<string>>) => ({
      connect: (await Promise.all(arr)).map(id => ({ id })),
   })

   const setStep = async (
      question: string,
      target: Promise<string>,
      path: Array<Promise<string>>,
   ) =>
      prisma
         .createStep({
            path: await setConnectArray(path),
            question,
            target: {
               connect: {
                  id: await target,
               },
            },
         })
         .id()

   const levelOne = [
      setMenu('Persona'),
      setMenu('Principal'),
      setMenu('Secundário'),
   ]
   const [persona, principal, secundario] = levelOne

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
      secundarioNoticias,
   ] = levelTwo

   const menus = [...levelOne, ...levelTwo]
   const menusConnect = setConnectArray(menus)

   const steps = [
      setStep('Encontre serviços e informações para alunos', personaAluno, [
         personaAluno,
      ]),
      setStep(
         'Encontre serviços e informações para professores',
         personaProfessores,
         [personaProfessores],
      ),
      setStep(
         'Encontre informações sobre a universidade',
         principalAUniversidade,
         [principalAUniversidade],
      ),
      setStep('Encontre informações sobre ensino', principalEnsino, [
         principalEnsino,
      ]),
      setStep('Encontre eventos na ufrj', secundarioEventos, [
         secundarioEventos,
      ]),
      setStep('Encontre noticias sobre a ufrj', secundarioNoticias, [
         secundarioNoticias,
      ]),
   ]
   const stepsConnect = setConnectArray(steps)

   const commons = {
      menus: await menusConnect,
      steps: await stepsConnect,
   }

   await prisma
      .createView({
         ...commons,
         company: {
            create: {
               abbr: 'UFRJ',
               name: 'Universidade Federal do Rio de Janeiro',
            },
         },
         tests: {
            create: [
               {
                  ...commons,
                  title: 'Teste de navegação do novo portal',
               },
            ],
         },
         welcome: {
            create: {
               message: `
               <p>Seja bem-vindo ao teste de navegação do Portal UFRJ! Obrigado por concordar em participar. Essa atividade deverá levar cerca de 10 minutos. Sua resposta nos ajudará a organizar o conteúdo do nosso novo portal.</p>
               <h2>Instruções</h2>
               <p>Como funciona o teste:</p>
               <ol>
                  <li>Será dada a você a tarefa de encontrar uma informação dentro de um menu.</li>
                  <li>Navegue pelo menu até que encontre o link onde acreditaria encontrar a informação solicitada.</li>
                  <li>Se não for pelo caminho que gostaria, você pode voltar clicando nos links de cima.</li>
               </ol>
               <i>Não estamos testando suas habilidade, não há respostas erradas.</i>
               `,
               title: 'Bem-vindo!',
            },
         },
      })
      .id()
}

// tslint:disable-next-line: no-console
main().catch(e => console.error(e))
