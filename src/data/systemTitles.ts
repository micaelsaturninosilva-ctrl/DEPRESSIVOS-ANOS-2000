export interface SystemTitleSuggestion {
  title: string;
  category: 'windows-bugs' | 'psicanalise-falhos' | 'crise-30' | 'bateria-social' | 'farmacia' | 'nostalgia-2000';
  buttonText?: string;
  badge?: string;
}

export const SYSTEM_TITLE_CATEGORIES = [
  { id: 'all', label: 'Todos os Trocadilhos', icon: '⚡' },
  { id: 'windows-bugs', label: '💻 Erros do Windows & Bugs', icon: '💻' },
  { id: 'psicanalise-falhos', label: '🛋️ Atos Falhos & Psicanálise', icon: '🛋️' },
  { id: 'crise-30', label: '🎂 Crise dos 30 & Vida Adulta', icon: '🎂' },
  { id: 'bateria-social', label: '🔋 Bateria Social & Ansiedade', icon: '🔋' },
  { id: 'farmacia', label: '💊 Farmacologia & Laudos', icon: '💊' },
  { id: 'nostalgia-2000', label: '💾 Nostalgia Anos 2000 & MSN', icon: '💾' },
] as const;

export const SYSTEM_TITLES_DATA: SystemTitleSuggestion[] = [
  // 💻 ERROS DO WINDOWS COM TROCADILHOS EXISTENCIAIS
  {
    title: 'Erro 404: Sanidade Não Encontrada',
    category: 'windows-bugs',
    buttonText: 'TENTAR NOVAMENTE',
    badge: '404',
  },
  {
    title: 'Erro Fatal: sobrecarga_emocional.exe',
    category: 'windows-bugs',
    buttonText: 'ABORTAR CRISE',
    badge: 'FATAL',
  },
  {
    title: 'Operação Ilegal: overthinking_noturno.bat',
    category: 'windows-bugs',
    buttonText: 'FINALIZAR TAREFA',
    badge: 'ILEGAL',
  },
  {
    title: 'Gerenciador de Tarefas: vida_adulta (Não Respondendo)',
    category: 'windows-bugs',
    buttonText: 'FORÇAR ENCERRAMENTO',
    badge: 'TRAVADO',
  },
  {
    title: 'Falha Geral de Proteção no Cérebro (0x00000030)',
    category: 'windows-bugs',
    buttonText: 'REINICIAR CÉREBRO',
    badge: 'CRASH',
  },
  {
    title: 'Tela Azul da Morte: crise_existencial.sys',
    category: 'windows-bugs',
    buttonText: 'ACEITAR O DESTINO',
    badge: 'BSOD',
  },
  {
    title: 'Não Respondendo: dopamina.exe',
    category: 'windows-bugs',
    buttonText: 'AGUARDAR RESPOSTA',
    badge: 'BUG',
  },
  {
    title: 'Crash do Sistema: adulto_sem_manual.exe',
    category: 'windows-bugs',
    buttonText: 'REPORTAR ERRO A DEUS',
    badge: 'CRASH',
  },
  {
    title: 'Windows Defender: Bloqueando Pessoas Tóxicas',
    category: 'windows-bugs',
    buttonText: 'ISOLAR AMEAÇA',
    badge: 'DEFENDER',
  },
  {
    title: 'Recycle Bin: expectativas_dos_20_anos',
    category: 'windows-bugs',
    buttonText: 'ESVAZIAR LIXEIRA',
    badge: 'LIXEIRA',
  },
  {
    title: 'Aviso do Windows: memoria_ram_social_0%',
    category: 'windows-bugs',
    buttonText: 'LIBERAR ESPAÇO',
    badge: 'MEMÓRIA',
  },
  {
    title: 'Erro de Buffer: excesso_de_pensamentos.vbs',
    category: 'windows-bugs',
    buttonText: 'IGNORAR COM SUCESSO',
    badge: 'BUFFER',
  },
  {
    title: 'Ctrl+Alt+Del da Sanidade Mental',
    category: 'windows-bugs',
    buttonText: 'BLOQUEAR MENTE',
    badge: 'HOTKEY',
  },
  {
    title: 'Erro de Driver: coluna_travada_ao_acordar.inf',
    category: 'windows-bugs',
    buttonText: 'INSTALAR DORFLEX',
    badge: 'DRIVER',
  },

  // 🛋️ ATOS FALHOS, PSICANÁLISE & FREUD
  {
    title: 'Ato Falho do Sistema - freud_explicaria.exe',
    category: 'psicanalise-falhos',
    buttonText: 'ANALISAR RECALQUE',
    badge: 'FREUD',
  },
  {
    title: 'Diálogo Psicanalítico - sessao_50min.log',
    category: 'psicanalise-falhos',
    buttonText: 'ACEITAR LAUDO',
    badge: 'DIVÃ',
  },
  {
    title: 'Mecanismo de Defesa: Negação.sys Ativado',
    category: 'psicanalise-falhos',
    buttonText: 'FINGIR QUE TÁ BEM',
    badge: 'DEFESA',
  },
  {
    title: 'Inconsciente.bat em Execução às 03:14',
    category: 'psicanalise-falhos',
    buttonText: 'ENCERRAR PROCESSO',
    badge: 'ID/EGO',
  },
  {
    title: 'Projeção Psicológica - espelho_quebrado.dll',
    category: 'psicanalise-falhos',
    buttonText: 'CULPAR O OUTRO',
    badge: 'PROJEÇÃO',
  },
  {
    title: 'Laudo Psicanalítico: Repressão em Nível Crítico',
    category: 'psicanalise-falhos',
    buttonText: 'CONFESSAR TRAUMA',
    badge: 'LAUDO',
  },
  {
    title: 'Recalque.exe finalizado com sucesso',
    category: 'psicanalise-falhos',
    buttonText: 'GUARDAR NO PEITO',
    badge: 'RECALQUE',
  },
  {
    title: 'Complexo de Abandono: conexao_interrompida',
    category: 'psicanalise-falhos',
    buttonText: 'MANDAR MENSAGEM PRO EX',
    badge: 'APEGO',
  },

  // 🎂 CRISE DOS 30 ANOS & VIDA ADULTA
  {
    title: 'Alerta da Idade - crise_dos_30.exe',
    category: 'crise-30',
    buttonText: 'COMPRAR AIRFRYER',
    badge: '30 ANOS',
  },
  {
    title: 'Corpo Estalando: coluna_30anos.dll',
    category: 'crise-30',
    buttonText: 'TOMAR ANTI-INFLAMATÓRIO',
    badge: 'COLUNA',
  },
  {
    title: 'Sonho de Consumo: colchao_ortopedico_d33.exe',
    category: 'crise-30',
    buttonText: 'PARCELAR EM 12X',
    badge: 'BOLETO',
  },
  {
    title: 'Boletos_Vencendo - pagamento_impossivel.bat',
    category: 'crise-30',
    buttonText: 'FINGIR DEMÊNCIA',
    badge: 'SERASA',
  },
  {
    title: 'Vida Adulta: tentativa_de_ser_funcional.exe',
    category: 'crise-30',
    buttonText: 'TOMAR CAFÉ DUPLO',
    badge: 'ROTINA',
  },
  {
    title: 'Manual da Vida: 404 Not Found',
    category: 'crise-30',
    buttonText: 'SEGUIR NA SORTE',
    badge: 'VIDA',
  },

  // 🔋 BATERIA SOCIAL & ANSIEDADE
  {
    title: 'Bateria Social: 0% Restando.sys',
    category: 'bateria-social',
    buttonText: 'SUMIR DO ROLÊ',
    badge: '0% BATERIA',
  },
  {
    title: 'Aviso Crítico: vontade_de_sumir.dll',
    category: 'bateria-social',
    buttonText: 'MODO QUARTO ESCURO',
    badge: 'VÁCUO',
  },
  {
    title: 'Cenários Catastróficos: 47_processos.exe',
    category: 'bateria-social',
    buttonText: 'SOFRER POR ANTECIPAÇÃO',
    badge: 'OVERTHINKING',
  },
  {
    title: 'Modo Avião Cerebral: isolamento_ativado',
    category: 'bateria-social',
    buttonText: 'DESCONECTAR GERAL',
    badge: 'ISOLADO',
  },
  {
    title: 'Vácuo no WhatsApp: processando_desculpa.exe',
    category: 'bateria-social',
    buttonText: 'ENVIAR FIGURINHA',
    badge: 'ZAP',
  },

  // 💊 FARMACOLOGIA & LAUDOS
  {
    title: 'Laudo Médico - CID_F32.exe',
    category: 'farmacia',
    buttonText: 'ACEITAR LAUDO',
    badge: 'CID-10',
  },
  {
    title: 'Bula Digital: Escitalopram 15mg em Ação',
    category: 'farmacia',
    buttonText: 'AGUARDAR 3 SEMANAS',
    badge: 'BULA',
  },
  {
    title: 'Alerta Farmácia: Zolpidem_02h_da_manha.exe',
    category: 'farmacia',
    buttonText: 'CANCELAR COMPRAS NO ML',
    badge: 'ZOLPIDEM',
  },
  {
    title: 'Efeito Colateral: libido_zero.dll',
    category: 'farmacia',
    buttonText: 'RECALCULAR PRIORIDADES',
    badge: 'FARMÁCIA',
  },
  {
    title: 'Diagnóstico Clínico: Sobrecarga Sináptica',
    category: 'farmacia',
    buttonText: 'RECEITAR DESCANSO',
    badge: 'SINAPSE',
  },

  // 💾 NOSTALGIA ANOS 2000 & MSN
  {
    title: 'MSN Messenger: (Ausente da Sanidade)',
    category: 'nostalgia-2000',
    buttonText: 'CHAMAR ATENÇÃO',
    badge: 'MSN',
  },
  {
    title: 'Winamp: tocando_tragedias_em_loop.mp3',
    category: 'nostalgia-2000',
    buttonText: 'VOLUME NO MÁXIMO',
    badge: 'WINAMP',
  },
  {
    title: 'Orkut: 100% Legal, 0% Emocionalmente Estável',
    category: 'nostalgia-2000',
    buttonText: 'ENVIAR DEPOIMENTO',
    badge: 'ORKUT',
  },
  {
    title: 'Windows Media Player 9 Series - MinhaVida.wmv',
    category: 'nostalgia-2000',
    buttonText: 'REPRODUZIR',
    badge: 'WMP',
  },
];

export function getRandomSystemTitle(): SystemTitleSuggestion {
  const randomIndex = Math.floor(Math.random() * SYSTEM_TITLES_DATA.length);
  return SYSTEM_TITLES_DATA[randomIndex];
}
