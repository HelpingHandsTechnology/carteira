import Link from "next/link"

export const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-white font-bold text-lg mb-4">Carteira</h3>
            <p className="text-sm">
              Gerencie suas assinaturas de forma inteligente, compartilhe custos e economize com segurança.
            </p>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4">Recursos</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/features/sharing" className="text-sm hover:text-white">
                  __Compartilhamento__
                </Link>
              </li>
              <li>
                <Link href="/features/security" className="text-sm hover:text-white">
                  __Segurança__
                </Link>
              </li>
              <li>
                <Link href="/features/payments" className="text-sm hover:text-white">
                  __Pagamentos__
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="text-sm hover:text-white">
                  __Planos__
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4">Suporte</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/help" className="text-sm hover:text-white">
                  __Central de Ajuda__
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-sm hover:text-white">
                  __Contato__
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-sm hover:text-white">
                  __FAQ__
                </Link>
              </li>
              <li>
                <Link href="/feedback" className="text-sm hover:text-white">
                  __Feedback__
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4">Legal</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/privacy" className="text-sm hover:text-white">
                  __Privacidade__
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-sm hover:text-white">
                  __Termos__
                </Link>
              </li>
              <li>
                <Link href="/security-policy" className="text-sm hover:text-white">
                  __Política de Segurança__
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-gray-800">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm">© {new Date().getFullYear()} Carteira. Todos os direitos reservados.</p>
            <div className="flex items-center gap-6">
              <Link href="https://twitter.com/carteira" className="text-sm hover:text-white">
                __Twitter__
              </Link>
              <Link href="https://linkedin.com/company/carteira" className="text-sm hover:text-white">
                __LinkedIn__
              </Link>
              <Link href="https://github.com/carteira" className="text-sm hover:text-white">
                __GitHub__
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
