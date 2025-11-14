import { useState } from 'react';
import { Card } from './components/ui/card';
import { Button } from './components/ui/button';
import { Alert } from './components/ui/alert';
import { Loader2, CheckCircle2, AlertCircle, Download } from 'lucide-react';
import { PdfUploadZone } from './components/PdfUploadZone';
import { FormField } from './components/FormField';
import { ThemeToggle } from './components/ThemeToggle';
import axios from 'axios';

interface DadosCliente {
  nomeCompleto: string;
  rg: string;
  cpf: string;
  endereco: string;
  cidade: string;
  cep: string;
  localData: string;
  dia: string;
  mes: string;
  ano: string;
  nacionalidade: string;
  estadoCivil: string;
  profissao: string;
  bairro: string;
  numero: string;
  representanteNomeCompleto: string;
  representanteRg: string;
  representanteCpf: string;
  representanteNacionalidade: string;
  representanteProfissao: string;
  representanteEstadoCivil: string;
}

type Status = 'idle' | 'processing' | 'success' | 'error';

export default function App() {
  const [dadosCliente, setDadosCliente] = useState<DadosCliente>({
    Nomecompleto: '',
    RG: '',
    CPF: '',
    Endereco: '',
    Cidade: '',
    CEP: '',
    localData: '',
    Dia: '',
    Mes: '',
    Ano: '',
    Nacionalidade: '',
    EstadoCivil: '',
    Profissao: '',
    Bairro: '',
    Numero: '',
    representanteNomeCompleto: '',
    representanteRg: '',
    representanteCpf: '',
    representanteNacionalidade: '',
    representanteProfissao: '',
    representanteEstadoCivil: '',
  });

  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [status, setStatus] = useState<Status>('idle');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [downloadUrl, setDownloadUrl] = useState<string>('');

  const handleInputChange = (field: keyof DadosCliente, value: string) => {
    setDadosCliente(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();


    
    if (!pdfFile) {
      setStatus('error');
      setErrorMessage('Por favor, selecione um arquivo PDF.');
      return;
    }

    setStatus('processing');
    setErrorMessage('');
    setDownloadUrl('');
    

    try {
      const formData = new FormData();
      formData.append('pdf_file', pdfFile);
      formData.append('dados_cliente', JSON.stringify(dadosCliente));

      const response = await fetch('https://script-complementacao.onrender.com/api/preencher-pdf', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Erro ao processar o PDF. Verifique os dados e tente novamente.');
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      setDownloadUrl(url);
      setStatus('success');
    } catch (error) {
      setStatus('error');
      setErrorMessage(error instanceof Error ? error.message : 'Erro desconhecido ao processar o PDF.');
    }
  };

  const handleDownload = () => {
    if (downloadUrl) {
      const a = document.createElement('a');
      a.href = downloadUrl;
      a.download = 'formulario-preenchido.pdf';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  };

  return (
    <div className="min-h-screen bg-[#fbfbfd] dark:bg-gray-950 py-12 px-4 sm:px-6 lg:px-8 transition-colors duration-300">
      <ThemeToggle />
      <div className="max-w-2xl mx-auto">
        <Card className="border-0 shadow-sm bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl rounded-[20px] overflow-hidden transition-colors duration-300">
          <div className="p-8 sm:p-12">
            {/* Cabeçalho */}
            <div className="mb-10 text-center">
              <h1 className="text-gray-900 dark:text-white mb-3 tracking-tight transition-colors duration-300">
                Complementação Automatica
              </h1>
              <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto leading-relaxed transition-colors duration-300">
                Preencha os dados abaixo e faça o upload do seu formulário PDF. 
                Geraremos automaticamente um PDF preenchido.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Formulário de Dados */}
              <div className="space-y-5">
                <h2 className="text-gray-900 dark:text-white pb-3 transition-colors duration-300">
                  Dados do Cliente
                </h2>
                
                <FormField
                  label="Nome Completo"
                  type="text"
                  placeholder="Digite o nome completo"
                  value={dadosCliente.nomeCompleto}
                  onChange={(value) => handleInputChange('Nome Completo', value)}
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FormField
                    label="RG"
                    type="text"
                    placeholder="Digite o RG"
                    value={dadosCliente.RG}
                    onChange={(value) => handleInputChange('RG', value)}
                  />

                  <FormField
                    label="CPF"
                    type="text"
                    placeholder="Digite o CPF"
                    value={dadosCliente.CPF}
                    onChange={(value) => handleInputChange('CPF', value)}
                  />
                </div>

                <FormField
                  label="Endereço"
                  type="text"
                  placeholder="Digite o endereço"
                  value={dadosCliente.Endereco}
                  onChange={(value) => handleInputChange('Endereco', value)}
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FormField
                    label="Número"
                    type="text"
                    placeholder="Digite o número da casa"
                    value={dadosCliente.Numero}
                    onChange={(value) => handleInputChange('Numero', value)}
                  />

                  <FormField
                    label="Bairro"
                    type="text"
                    placeholder="Digite o bairro"
                    value={dadosCliente.Bairro}
                    onChange={(value) => handleInputChange('Bairro', value)}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FormField
                    label="Cidade"
                    type="text"
                    placeholder="Digite a cidade"
                    value={dadosCliente.Cidade}
                    onChange={(value) => handleInputChange('Cidade', value)}
                  />

                  <FormField
                    label="CEP"
                    type="text"
                    placeholder="Digite o CEP"
                    value={dadosCliente.CEP}
                    onChange={(value) => handleInputChange('CEP', value)}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FormField
                    label="Nacionalidade"
                    type="text"
                    placeholder="Digite a nacionalidade"
                    value={dadosCliente.Nacionalidade}
                    onChange={(value) => handleInputChange('Nacionalidade', value)}
                  />

                  <FormField
                    label="Estado Civil"
                    type="text"
                    placeholder="Digite o estado civil"
                    value={dadosCliente.EstadoCivil}
                    onChange={(value) => handleInputChange('EstadoCivil', value)}
                  />
                </div>

                <FormField
                  label="Profissão"
                  type="text"
                  placeholder="Digite a profissão"
                  value={dadosCliente.Profissao}
                  onChange={(value) => handleInputChange('Profissao', value)}
                />

                <FormField
                  label="Local e Data"
                  type="text"
                  placeholder="Digite o local da assinatura do documento"
                  value={dadosCliente.localData}
                  onChange={(value) => handleInputChange('localData', value)}
                />

                <div className="grid grid-cols-3 gap-4">
                  <FormField
                    label="Dia"
                    type="text"
                    placeholder="Digite o dia"
                    value={dadosCliente.Dia}
                    onChange={(value) => handleInputChange('Dia', value)}
                  />

                  <FormField
                    label="Mês"
                    type="text"
                    placeholder="Digite o mês por extenso (Ex: Dezembro)"
                    value={dadosCliente.Mes}
                    onChange={(value) => handleInputChange('Mes', value)}
                  />

                  <FormField
                    label="Ano"
                    type="text"
                    placeholder="Digite o ano"
                    value={dadosCliente.Ano}
                    onChange={(value) => handleInputChange('Ano', value)}
                  />
                </div>
              </div>

              {/* Dados do Representante */}
              <div className="space-y-5 pt-4">
                <h2 className="text-gray-900 dark:text-white pb-3 transition-colors duration-300">
                  Dados do Representante
                </h2>
                
                <FormField
                  label="Representante - Nome Completo"
                  type="text"
                  placeholder="Digite o nome completo do representante"
                  value={dadosCliente.representanteNomeCompleto}
                  onChange={(value) => handleInputChange('representanteNomeCompleto', value)}
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FormField
                    label="Representante - RG"
                    type="text"
                    placeholder="Digite o RG do representante"
                    value={dadosCliente.representanteRg}
                    onChange={(value) => handleInputChange('representanteRg', value)}
                  />

                  <FormField
                    label="Representante - CPF"
                    type="text"
                    placeholder="Digite o CPF do representante"
                    value={dadosCliente.representanteCpf}
                    onChange={(value) => handleInputChange('representanteCpf', value)}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FormField
                    label="Representante - Nacionalidade"
                    type="text"
                    placeholder="Digite a nacionalidade do representante"
                    value={dadosCliente.representanteNacionalidade}
                    onChange={(value) => handleInputChange('representanteNacionalidade', value)}
                  />

                  <FormField
                    label="Representante - Profissão"
                    type="text"
                    placeholder="Digite a profissão do representante"
                    value={dadosCliente.representanteProfissao}
                    onChange={(value) => handleInputChange('representanteProfissao', value)}
                  />
                </div>

                <FormField
                  label="Representante - Estado Civil"
                  type="text"
                  placeholder="Digite o estado civil do representante"
                  value={dadosCliente.representanteEstadoCivil}
                  onChange={(value) => handleInputChange('representanteEstadoCivil', value)}
                />
              </div>

              {/* Upload de PDF */}
              <div className="space-y-5 pt-4">
                <h2 className="text-gray-900 dark:text-white pb-3 transition-colors duration-300">
                  Formulário PDF
                </h2>
                
                <PdfUploadZone
                  file={pdfFile}
                  onFileSelect={setPdfFile}
                  disabled={status === 'processing'}
                />
              </div>

              {/* Feedback de Processamento */}
              {status === 'processing' && (
                <Alert className="bg-blue-50/50 dark:bg-blue-950/30 border-blue-100 dark:border-blue-900 rounded-[16px] backdrop-blur-sm transition-colors duration-300">
                  <Loader2 className="size-4 animate-spin text-blue-600 dark:text-blue-400" />
                  <div className="ml-2 text-blue-700 dark:text-blue-300 transition-colors duration-300">
                    Processando seu PDF... Por favor, aguarde.
                  </div>
                </Alert>
              )}

              {/* Feedback de Sucesso */}
              {status === 'success' && (
                <Alert className="bg-green-50/50 dark:bg-green-950/30 border-green-100 dark:border-green-900 rounded-[16px] backdrop-blur-sm transition-colors duration-300">
                  <CheckCircle2 className="size-4 text-green-600 dark:text-green-400" />
                  <div className="ml-2 flex-1">
                    <p className="text-green-700 dark:text-green-300 transition-colors duration-300">
                      PDF preenchido com sucesso!
                    </p>
                  </div>
                  <Button
                    type="button"
                    onClick={handleDownload}
                    size="sm"
                    className="size-9 mr-4 bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-600 transition-colors duration-300"
                  >
                    <Download className="size-4 mr-2" />
                    Download
                  </Button>
                </Alert>
              )}

              {/* Feedback de Erro */}
              {status === 'error' && (
                <Alert className="bg-red-50/50 dark:bg-red-950/30 border-red-100 dark:border-red-900 rounded-[16px] backdrop-blur-sm transition-colors duration-300">
                  <AlertCircle className="size-4 text-red-600 dark:text-red-400" />
                  <div className="ml-2 text-red-700 dark:text-red-300 transition-colors duration-300">
                    {errorMessage}
                  </div>
                </Alert>
              )}

              {/* Botão de Ação */}
              <Button
                type="submit"
                className="w-full h-12 bg-black hover:bg-gray-800 dark:bg-white dark:hover:bg-gray-100 
                           text-white dark:text-black rounded-full transition-all duration-200 
                           shadow-sm hover:shadow-md"
                disabled={status === 'processing'}
              >
                {status === 'processing' ? (
                  <>
                    <Loader2 className="size-4 mr-2 animate-spin" />
                    Processando...
                  </>
                ) : (
                  'Gerar PDF Preenchido'
                )}
              </Button>
            </form>
          </div>
        </Card>
      </div>
    </div>
  );
}
