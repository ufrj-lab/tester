import { prisma } from '../src/generated/prisma-client'

async function main() {
   const setConnectArray = async (arr: Array<Promise<string>>) => ({
      connect: (await Promise.all(arr)).map(id => ({ id })),
   })

   const setMenu = async (
      name: string,
      parents: Array<Promise<string>> | undefined = undefined,
      root: boolean = false,
   ): Promise<string> =>
      prisma
         .createMenu({
            menus: parents && (await setConnectArray(parents)),
            name,
            root,
         })
         .id()

   const setListMenu = (
      array: string[],
      parent: Array<Promise<string>> | undefined = undefined,
      root: boolean = false,
   ) => array.map(name => setMenu(name, parent, root))

   interface IInputPath {
      parent: Promise<string>
      paths: Array<Array<Promise<string>>>
   }

   const setPath = async (
      step: IInputPath,
   ): Promise<Array<Promise<string>>> => {
      const { parent, paths: pathsAll } = step

      return pathsAll.map(async path =>
         prisma
            .createPath({
               parent: { connect: { id: await parent } },
               paths: await setConnectArray(path),
            })
            .id(),
      )
   }

   const setStep = async (
      question: string,
      targets: Array<Promise<string>> | undefined = undefined,
      pathsT: Array<Array<Promise<string>>> | undefined = undefined,
      type: Array<Promise<string>>,
   ) => ({
      parent: prisma
         .createStep({
            question,
            targets: targets && (await setConnectArray(targets)),
            type: await setConnectArray(type),
         })
         .id(),
      paths: pathsT,
   })

   const levelZero = setListMenu(
      ['Persona', 'Principal', 'Secundário'],
      undefined,
      true,
   )
   const [persona, principal, secundario] = levelZero

   const personas = setListMenu(
      ['Alunos', 'Professor', 'Servidor', 'Sociedade', 'Imprensa'],
      [persona],
   )
   const [
      personaAluno,
      personaProfessor,
      personaServidor,
      personaSocieadade,
      personaImprensa,
   ] = personas

   const principais = setListMenu(
      ['A Universidade', 'Ensino', 'Pesquisa', 'Ingresso', 'Nos Campi'],
      [principal],
   )
   const [
      principalAUniversidade,
      principalEnsino,
      principalPesquisa,
      principalIngresso,
      principalNosCampi,
   ] = principais

   const secundarios = setListMenu(
      [
         'Notícias',
         'Eventos',
         'Sistemas',
         'Relações Internacionais',
         'Acessibilidade',
      ],
      [secundario],
   )
   const [
      secundarioNoticias,
      secundarioEventos,
      secundarioSistemas,
      secundarioRelacoesInternacionais,
      secundarioAcessibilidade,
   ] = secundarios

   const levelOne = [...personas, ...principais, ...secundarios]

   const levelTwo = [
      setMenu('Carreira e Qualificação', [personaServidor, personaProfessor]),
      setMenu('Serviços', [personaSocieadade]),
      setMenu('Ingresso', [personaSocieadade]),
      setMenu('Formação', [personaAluno, principalEnsino]),
      setMenu('Ferramentas Acadêmicas', [personaAluno, personaProfessor]),
      setMenu('Produção Acadêmica', [principalPesquisa]),
      setMenu('Ferramentas Administrativas', [
         personaProfessor,
         personaServidor,
      ]),
      setMenu('Saúde e Bem-estar', [personaProfessor, personaServidor]),
      setMenu('A Reitoria', [principalAUniversidade]),
      setMenu('Transparência', [secundario, principalAUniversidade]),
   ]

   const [
      carreiraQualificacao,
      servicos,
      ingresso,
      formacao,
      ferramentasAcademicas,
      producaoAcademica,
      ferramentasAdministrativas,
      saudeBemEstar,
      reitoria,
      transparencia,
   ] = levelTwo

   const levelTree = [
      setMenu('Capacitação', [principalEnsino, carreiraQualificacao]),
      setMenu('Educação Básica', [principalEnsino, servicos]),
      setMenu('Pessoal', [principalIngresso, ingresso]),
      setMenu('Residência Profissional', [
         principalEnsino,
         principalIngresso,
         formacao,
         ingresso,
      ]),
      setMenu('Comunicação', [principalAUniversidade]),
      setMenu('Iniciativas', [principalPesquisa]),
      setMenu('Formação Docente', [principalEnsino, formacao]),
      setMenu('Bolsas', [principalPesquisa]),
      setMenu('Calendário Acadêmico', [ferramentasAcademicas]),
      setMenu('SIGA', [ferramentasAcademicas, secundarioSistemas]),
      setMenu('Iniciações', [formacao]),
      setMenu('Periódicos', [ferramentasAcademicas]),
      setMenu('Planos de Carreira', [carreiraQualificacao]),
      setMenu('SIGEPE', [ferramentasAdministrativas, secundarioSistemas]),
      setMenu('Perícias', [saudeBemEstar]),
   ]
   const [
      capacitacao,
      educacaoBasica,
      pessoal,
      residenciaProfissional,
      comunicacao,
      iniciativas,
      formacaoDocente,
      bolsas,
      calendarioAcademico,
      siga,
      iniciacoes,
      periodicos,
      planosCarreira,
      sigepe,
      pericias,
   ] = levelTree

   const menus = [...levelZero, ...levelOne, ...levelTwo, ...levelTree]
   const menusConnect = setConnectArray(menus)

   const keyUserType = ['PROFESSOR', 'STUDENT', 'STAFF', 'ALL'].map(key =>
      prisma.createKeyUserType({ key }).id(),
   )

   const [targetProfessor, targetStudent, targetStaff, targetAll] = keyUserType

   const steps = [
      setStep(
         'Encontre as datas relevantes para o ano letivo.',
         [calendarioAcademico],
         [[personaAluno, ferramentasAcademicas, calendarioAcademico]],
         [targetStudent],
      ),
      setStep(
         'Encontre a ferramenta utilizada para se matricular em uma disciplina.',
         [siga],
         [
            [secundarioSistemas, siga],
            [personaAluno, ferramentasAcademicas, siga],
         ],
         [targetStudent],
      ),
      setStep(
         'Encontre bolsas de monitoria disponíveis.',
         [iniciacoes],
         [[personaAluno, formacao, iniciacoes]],
         [targetStudent],
      ),
      setStep(
         'Encontre a periódicos e artigos produzidos na UFRJ.',
         [producaoAcademica, periodicos],
         [
            [principalPesquisa, producaoAcademica],
            [personaProfessor, ferramentasAcademicas, periodicos],
         ],
         [targetProfessor],
      ),
      setStep(
         'Encontre a ferramenta utilizada para lançar notas de alunos.',
         [siga],
         [
            [secundarioSistemas, siga],
            [personaProfessor, ferramentasAcademicas, siga],
         ],
         [targetProfessor],
      ),
      setStep(
         'Encontre mais informações sobre seu plano de carreira.',
         [planosCarreira],
         [[personaProfessor, carreiraQualificacao, planosCarreira]],
         [targetProfessor],
      ),
      setStep(
         'Encontre a ferramenta utilizada para marcar suas férias.',
         [sigepe],
         [
            [secundarioSistemas, sigepe],
            [personaServidor, ferramentasAdministrativas, sigepe],
         ],
         [targetStaff],
      ),
      setStep(
         'Encontre como agendar perícia médica para pedido de afastamento.',
         [pericias],
         [[personaServidor, saudeBemEstar, pericias]],
         [targetStaff],
      ),
      setStep(
         'Encontre cursos de capacitação voltados para sua área de atuação.',
         [capacitacao],
         [
            [principalEnsino, capacitacao],
            [personaServidor, carreiraQualificacao, capacitacao],
         ],
         [targetStaff],
      ),
      setStep(
         'Encontre informações sobre a prefeitura da cidade universitária.',
         [reitoria],
         [[principalAUniversidade, reitoria]],
         [targetAll],
      ),
      setStep(
         'Encontre informações sobre a escola de educação infantil da UFRJ.',
         [educacaoBasica],
         [
            [principalEnsino, educacaoBasica],
            [personaSocieadade, servicos, educacaoBasica],
         ],
         [targetAll],
      ),
      setStep(
         'Encontre os concursos disponíveis para servidores e professores.',
         [pessoal],
         [[principalIngresso, pessoal], [personaSocieadade, ingresso, pessoal]],
         [targetAll],
      ),
      setStep(
         'Encontre as vagas disponíveis para a residência médica em pediatria.',
         [residenciaProfissional],
         [
            [principalEnsino, residenciaProfissional],
            [principalIngresso, residenciaProfissional],
            [personaAluno, formacao, residenciaProfissional],
            [personaSocieadade, ingresso, residenciaProfissional],
         ],
         [targetAll],
      ),
      setStep(
         'Encontre o contato da assessoria de imprensa do gabinete do reitor.',
         [comunicacao],
         [[principalAUniversidade, comunicacao]],
         [targetAll],
      ),
      setStep(
         'Encontre informações sobre seminários de discussão e apresentação de trabalhos científicos.',
         [secundarioEventos, iniciativas],
         [[secundarioEventos], [principalAUniversidade, iniciativas]],
         [targetAll],
      ),
      setStep(
         'Encontre dados sobre as finanças da UFRJ em 2018.',
         [transparencia],
         [[transparencia], [principalAUniversidade, transparencia]],
         [targetAll],
      ),
      setStep(
         'Encontre informações sobre políticas de incentivo à formação de professores.',
         [formacaoDocente],
         [
            [principalEnsino, formacaoDocente],
            [personaAluno, formacao, formacaoDocente],
         ],
         [targetAll],
      ),
      setStep(
         'Encontre informações sobre bolsas de pós-doutorado.',
         [bolsas],
         [[principalPesquisa, bolsas]],
         [targetAll],
      ),
   ]

   const paths: Array<Array<Promise<string>>> = []

   const stepsConnect = setConnectArray(
      steps.map(async step => {
         const { parent, paths: PromsiePaths } = await step

         if (PromsiePaths) {
            PromsiePaths.push(await setPath({ parent, paths: PromsiePaths }))
         }

         return parent
      }),
   )

   const keyResultStatus = [
      'SUCCESS',
      'PARTIAL',
      'FAIL',
      'ABORTED',
      'FINISH',
   ].map(key => prisma.createKeyResultStatus({ key }).id())

   const userType = await setConnectArray(keyUserType)
   const resultStatus = await setConnectArray(keyResultStatus)

   const commons = {
      menus: await menusConnect,
      steps: await stepsConnect,
   }

   const keys = {
      resultStatus,
      userType,
   }

   await Promise.all(paths)
   await prisma.createKeys(keys).id()

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
