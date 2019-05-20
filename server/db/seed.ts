import {
   CompanyCreateOneWithoutTestsInput,
   KeyCreateInput,
   KeyCreateOneInput,
   Maybe,
   MenuCreateManyInput,
   MenuCreateManyWithoutMenusInput,
   MessageCreateOneInput,
   MultiLanguageContentCreateOneInput,
   prisma,
   StepCreateManyInput,
} from '../src/generated/prisma-client'

import { writeFile as writeFileDefault } from 'fs'
import { resolve } from 'path'
import { promisify } from 'util'

const writeFile = promisify(writeFileDefault)

export async function seedingDataBase() {
   if ((await prisma.keys()).length > 0) {
      // tslint:disable-next-line: no-console
      console.info('Seeding already make!')
      return writeFile(
         resolve(__dirname, '../src/generated/initial.json'),
         JSON.stringify({ ...(await prisma.tests({ first: 1 }))[0] }),
      )
   } else {
      // tslint:disable-next-line: no-console
      console.info('Seeding...')
   }

   const menusResult = {
      personas: await createMenu({
         itemsCreate: [
            {
               itemsCreate: [
                  { name: 'Formação', itemsCreate: [{ name: 'Iniciações' }] },
               ],
               name: 'Alunos',
            },
            {
               itemsCreate: [
                  {
                     itemsCreate: [{ name: 'Planos de Carreira' }],
                     name: 'Carreira e Qualificação',
                  },
                  {
                     itemsCreate: [{ name: 'Perícias' }],
                     name: 'Saúde e Bem-estar',
                  },
                  {
                     itemsCreate: [
                        { name: 'Calendário Acadêmico' },
                        { name: 'SIGA' },
                        { name: 'Periódicos' },
                     ],
                     name: 'Ferramentas Acadêmicas',
                  },
                  {
                     itemsCreate: [{ name: 'SIGEPE' }],
                     name: 'Ferramentas Administrativas',
                  },
               ],
               name: 'Professor',
            },
            { name: 'Servidor' },
            {
               itemsCreate: [{ name: 'Serviços' }],

               name: 'Sociedade',
            },
            { name: 'Imprensa' },
         ],
         name: 'Persona',
         order: 1,
         root: true,
      }),
      principal: await createMenu({
         itemsCreate: [
            {
               itemsCreate: [
                  { name: 'A Reitoria' },
                  { name: 'Transparência' },
                  { name: 'Comunicação' },
               ],
               name: 'A Universidade',
            },
            {
               itemsCreate: [
                  { name: 'Capacitação' },
                  { name: 'Educação Básica' },
                  { name: 'Residência Profissional' },
                  { name: 'Formação Docente' },
               ],
               name: 'Ensino',
            },
            {
               itemsCreate: [
                  { name: 'Produção Acadêmica' },
                  { name: 'Iniciativas' },
                  { name: 'Bolsas' },
               ],
               name: 'Pesquisa',
            },
            { name: 'Ingresso', itemsCreate: [{ name: 'Pessoal' }] },
            { name: 'Nos Campi' },
         ],

         name: 'Principal',
         order: 2,
         root: true,
      }),
      secundario: await createMenu({
         itemsCreate: [
            { name: 'Notícias' },
            { name: 'Eventos' },
            { name: 'Sistemas' },
            { name: 'Relações Internacionais' },
            { name: 'Acessibilidade' },
         ],
         name: 'Secundário',
         order: 3,
         root: true,
      }),
   }

   const flatObjMenus = convertObjMenusToFlatObject(menusResult)

   logMenuDefinitions(flatObjMenus)

   const {
      Alunos,
      Formacao,
      Iniciacoes,
      Professor,
      CarreiraeQualificacao,
      PlanosdeCarreira,
      SaudeeBemestar,
      Pericias,
      FerramentasAcademicas,
      CalendarioAcademico,
      SIGA,
      Periodicos,
      FerramentasAdministrativas,
      SIGEPE,
      Servidor,
      Sociedade,
      Servicos,
      AUniversidade,
      AReitoria,
      Transparencia,
      Comunicacao,
      Ensino,
      Capacitacao,
      EducacaoBasica,
      ResidenciaProfissional,
      FormacaoDocente,
      Pesquisa,
      ProducaoAcademica,
      Iniciativas,
      Bolsas,
      Ingresso,
      Pessoal,
      Secundario,
      Eventos,
      Sistemas,
   } = flatObjMenus

   await updateMenus([
      {
         ...Servidor,
         connect: [
            FerramentasAdministrativas,
            CarreiraeQualificacao,
            SaudeeBemestar,
         ],
      },
      {
         ...Alunos,
         connect: [FerramentasAcademicas],
      },
      {
         ...Ingresso,
         connect: [ResidenciaProfissional],
      },
      {
         ...Sociedade,
         connect: [Ingresso],
      },
      {
         ...Secundario,
         connect: [Transparencia],
      },
      {
         ...CarreiraeQualificacao,
         connect: [Capacitacao],
      },
      {
         ...Servicos,
         connect: [EducacaoBasica],
      },
      {
         ...Formacao,
         connect: [ResidenciaProfissional, FormacaoDocente],
      },
      {
         ...Sistemas,
         connect: [SIGA, SIGEPE],
      },
   ])

   const userTypes = ['STUDENT', 'PROFESSOR', 'STAFF', 'ALL']
   const languages = ['PT', 'EN']
   const [userStudent, userProfessor, userStaff, userAll] = userTypes
   const [pt] = languages

   const steps = [
      {
         paths: [[Alunos, FerramentasAcademicas, CalendarioAcademico]],
         question: 'Encontre as datas relevantes para o ano letivo.',
         userType: [userStudent],
      },
      {
         paths: [[Sistemas, SIGA], [Alunos, FerramentasAcademicas, SIGA]],
         question:
            'Encontre a ferramenta utilizada para se matricular em uma disciplina.',
         userType: [userStudent],
      },
      {
         paths: [[Alunos, Formacao, Iniciacoes]],
         question: 'Encontre bolsas de monitoria disponíveis.',
         userType: [userStudent],
      },
      {
         paths: [
            [Pesquisa, ProducaoAcademica],
            [Professor, FerramentasAcademicas, Periodicos],
         ],
         question: 'Encontre a periódicos e artigos produzidos na UFRJ.',
         userType: [userProfessor],
      },
      {
         paths: [[Sistemas, SIGA], [Professor, FerramentasAcademicas, SIGA]],
         question:
            'Encontre a ferramenta utilizada para lançar notas de alunos.',
         userType: [userProfessor],
      },
      {
         paths: [[Professor, CarreiraeQualificacao, PlanosdeCarreira]],
         question: 'Encontre mais informações sobre seu plano de carreira.',
         userType: [userProfessor],
      },
      {
         paths: [
            [Sistemas, SIGEPE],
            [Servidor, FerramentasAdministrativas, SIGEPE],
         ],
         question: 'Encontre a ferramenta utilizada para marcar suas férias.',
         userType: [userStaff],
      },
      {
         paths: [[Servidor, SaudeeBemestar, Pericias]],
         question:
            'Encontre como agendar perícia médica para pedido de afastamento.',
         userType: [userStaff],
      },
      {
         paths: [
            [Ensino, Capacitacao],
            [Servidor, CarreiraeQualificacao, Capacitacao],
         ],
         question:
            'Encontre cursos de capacitação voltados para sua área de atuação.',
         userType: [userStaff],
      },
      {
         paths: [[AUniversidade, AReitoria]],
         question:
            'Encontre informações sobre a prefeitura da cidade universitária.',
         userType: [userAll],
      },
      {
         paths: [
            [Ensino, EducacaoBasica],
            [Sociedade, Servicos, EducacaoBasica],
         ],
         question:
            'Encontre informações sobre a escola de educação infantil da UFRJ.',
         userType: [userAll],
      },
      {
         paths: [[Ingresso, Pessoal], [Sociedade, Ingresso, Pessoal]],
         question:
            'Encontre os concursos disponíveis para servidores e professores.',
         userType: [userAll],
      },
      {
         paths: [
            [Ensino, ResidenciaProfissional],
            [Ingresso, ResidenciaProfissional],
            [Alunos, Formacao, ResidenciaProfissional],
            [Sociedade, Ingresso, ResidenciaProfissional],
         ],
         question:
            'Encontre as vagas disponíveis para a residência médica em pediatria.',
         userType: [userAll],
      },
      {
         paths: [[AUniversidade, Comunicacao]],
         question:
            'Encontre o contato da assessoria de imprensa do gabinete do reitor.',
         userType: [userAll],
      },
      {
         paths: [[Eventos], [AUniversidade, Iniciativas]],
         question:
            'Encontre informações sobre seminários de discussão e apresentação de trabalhos científicos.',
         userType: [userAll],
      },
      {
         paths: [[Transparencia], [AUniversidade, Transparencia]],
         question: 'Encontre dados sobre as finanças da UFRJ em 2018.',
         userType: [userAll],
      },
      {
         paths: [
            [Ensino, FormacaoDocente],
            [Alunos, Formacao, FormacaoDocente],
         ],
         question:
            'Encontre informações sobre políticas de incentivo à formação de professores.',
         userType: [userAll],
      },
      {
         paths: [[Pesquisa, Bolsas]],
         question: 'Encontre informações sobre bolsas de pós-doutorado.',
         userType: [userAll],
      },
   ]

   const keys = await createKey({
      languages,
      stepResultStatus: ['SUCCESS', 'PARTIAL', 'FAIL'],
      testResultStatus: ['ABORTED', 'FINISH'],
      userTypes,
   })

   const id = await prisma
      .createTest({
         company: setCreateCompany({
            abbr: 'UFRJ',
            name: 'Universidade Federal do Rio de Janeiro',
            welcomeBody: 'legal',
            welcomeTitle: 'oie',
         }),
         instruction: setCreateMessage({
            message:
               '<p>Seja bem-vindo ao teste de navegação do Portal UFRJ! Obrigado por concordar em participar. Essa atividade deverá levar cerca de 10 minutos. Sua resposta nos ajudará a organizar o conteúdo do nosso novo portal.</p><h2>Instruções</h2><p>Como funciona o teste:</p><ol><li>Será dada a você a tarefa de encontrar uma informação dentro de um menu.</li><li>Navegue pelo menu até que encontre o link onde acreditaria encontrar a informação solicitada.</li><li>Se não for pelo caminho que gostaria, você pode voltar clicando nos links de cima.</li></ol><i>Não estamos testando suas habilidade, não há respostas erradas.</i>',
            title: 'Instruções',
         }),
         keys: keys as KeyCreateOneInput,
         languages: setConnectMany(setKeyInArray([pt])),
         // tslint:disable-next-line:no-object-literal-type-assertion
         menus: {
            ...convertObjMenusToArrayConnect(flatObjMenus),
         } as Maybe<MenuCreateManyInput>,
         publics: setConnectMany(setKeyInArray(userTypes)),
         steps: setCreateManyStep(steps) as Maybe<StepCreateManyInput>,
         title: setCreatePt('Teste de navegação do novo portal'),
      })
      .id()

   return writeFile(
      resolve(__dirname, '../src/generated/initial.json'),
      JSON.stringify({ id }),
   )
}

seedingDataBase()
   // tslint:disable-next-line: no-console
   .then(() => console.info('Seeding done!'))
   // tslint:disable-next-line: no-console
   .catch(e => console.error(e))

// DETAILS ==========================================

async function createKey(data: any) {
   return setConnect({
      id: await prisma.createKey(setKeys(data) as KeyCreateInput).id(),
   })
}
async function createMenu({
   name,
   order,
   itemsCreate,
   itemsConnect,
   root,
}: IMenuCreate) {
   const data = setCreateMenu({ name, order, itemsCreate, itemsConnect, root })
   return prisma.createMenu(data).$fragment(`
         fragment MenuIdName on Menu {
            id
            name {
               pt
            }
            items {
               id
               name {
                  pt
               }
               items {
                  id
                  name {
                     pt
                  }
                  items {
                     id
                     name {
                        pt
                     }
                  }
               }
            }
         }
      `)
}

function setStep(step: any) {
   const { paths, question, userType } = step
   return {
      paths: setCreateMany(
         paths.map((path: any) => ({ items: setConnectMany(path) })),
      ),
      question: setCreatePt(question),
      targets: setConnectMany(
         paths
            .map((path: any) => path[path.length - 1])
            .filter(
               (item: any, pos: number, arr: any[]) =>
                  arr.indexOf(item) === pos,
            ),
      ),
      type: setConnectMany(userType.map((key: any) => ({ key }))),
   }
}
function setCreateManyStep(steps: object[]) {
   return setCreateMany(steps.map(step => setStep(step)))
}
function setCreateManyMenu(arr: IMenuCreate[]) {
   return setCreateMany(
      arr.map(({ name, itemsCreate, itemsConnect, root }: IMenuCreate) =>
         setCreateMenu({ name, itemsCreate, itemsConnect, root }),
      ),
   )
}

function setConnectManyMenu(arr: IMenuConnect[]) {
   return setConnectMany(
      arr.map(({ id }: IMenuConnect) => ({
         id,
      })),
   )
}

function setCreateMenu({
   name,
   root,
   order,
   itemsConnect,
   itemsCreate,
}: IMenuCreate): IMenuPrisma {
   return {
      items: ((itemsCreate || itemsConnect) && {
         ...(itemsCreate && setCreateManyMenu(itemsCreate)),
         ...(itemsConnect && setConnectManyMenu(itemsConnect)),
      }) as MenuCreateManyWithoutMenusInput,
      name: setCreatePt(name),
      order,
      root,
   }
}

function setCreateCompany({
   name,
   welcomeTitle: title,
   welcomeBody: message,
   abbr,
}: ICompany) {
   return setCreate({
      abbr,
      name,
      welcome: setCreateMessage({ title, message }),
   }) as CompanyCreateOneWithoutTestsInput
}

function setKeys({
   languages,
   stepResultStatus,
   testResultStatus,
   userTypes,
}: IKeys) {
   return {
      languages: setCreateMany(setKeyInArray(languages)),
      stepResultStatus: setCreateMany(setKeyInArray(stepResultStatus)),
      testResultStatus: setCreateMany(setKeyInArray(testResultStatus)),
      userTypes: setCreateMany(setKeyInArray(userTypes)),
   }
}

function setKeyInArray(arr: string[]) {
   return arr.map(key => setKey(key))
}

function setCreatePt(str: string) {
   return setCreate({ pt: str }) as MultiLanguageContentCreateOneInput
}

function setCreateMessage({ title, message }: IMessage) {
   return setCreate({
      message: setCreatePt(message),
      title: setCreatePt(title),
   }) as MessageCreateOneInput
}

function setCreate(target: object) {
   return { create: target }
}
function setCreateMany(target: object[]) {
   return { create: target }
}

function setConnect(target: object) {
   return { connect: target }
}
function setConnectMany(target: object[]) {
   return { connect: target }
}

function setKey(str: string) {
   return { key: str }
}

function convertObjMenusToFlatObject(menus: any): any {
   const objMenus = {}

   function setNewElement(
      name: string,
      id: string,
      tryName?: string,
      numberTry = 0,
   ) {
      const baseKey = !tryName
         ? name
              .replace(/[ãá]/gim, 'a')
              .replace(/[ôõó]/gim, 'o')
              .replace(/[ç]/gim, 'c')
              .replace(/[í]/gim, 'i')
              .replace(/[ú]/gim, 'u')
              .replace(/[ê]/gim, 'e')
              .replace(/[-]/gim, '')
              .split(' ')
              .join('')
              .trim()
         : tryName

      const realKey =
         numberTry > 0
            ? `${baseKey}${String.fromCharCode(65 + numberTry)}`
            : baseKey

      // @ts-ignore
      const newElement = objMenus[realKey]

      if (!newElement) {
         // @ts-ignore
         objMenus[realKey] = { id }
      } else {
         setNewElement(name, id, baseKey, numberTry + 1)
      }
   }
   function convertElement(element: any) {
      const {
         id,
         name: { pt: name },
         items,
      } = element

      setNewElement(name, id)

      if (items) {
         items.forEach((subElement: any) => convertElement(subElement))
      }
   }

   // tslint:disable-next-line:forin
   for (const key in menus) {
      convertElement(menus[key])
   }

   return objMenus
}

function updateMenus(arr: Array<Promise<any>>) {
   return Promise.all(
      arr.map(({ id, connect }: any) =>
         prisma.updateMenu({ where: { id }, data: { items: { connect } } }),
      ),
   )
}

function logMenuDefinitions(objMenus: any) {
   // tslint:disable-next-line: no-console
   console.log(
      `\n\nStart menu definitions ===================\n\nconst {\n${Object.keys(
         objMenus,
      )
         .map(key => `    ${key}`)
         .join(
            ',\n',
         )}\n} = objMenus\n\nEnd menu definitions ===================\n\n`,
   )
}

function convertObjMenusToArrayConnect(objMenus: any) {
   return setConnectMany(Object.keys(objMenus).map(key => objMenus[key]))
}

interface IMessage {
   title: string
   message: string
}

interface IKeys {
   languages: string[]
   stepResultStatus: string[]
   testResultStatus: string[]
   userTypes: string[]
}

interface ICompany {
   name: string
   welcomeTitle: string
   welcomeBody: string
   abbr?: string
}

interface IMenuConnect {
   id: string
}

interface IMenuCreate {
   name: string
   order?: number
   itemsCreate?: IMenuCreate[]
   itemsConnect?: IMenuConnect[]
   noCreate?: boolean
   root?: boolean
}
interface IMenuPrisma {
   name: MultiLanguageContentCreateOneInput
   items?: Maybe<MenuCreateManyWithoutMenusInput>
   order?: number
   root?: boolean
}
