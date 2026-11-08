const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'src', 'app', 'checkout', 'CheckoutClient.tsx');
let content = fs.readFileSync(filePath, 'utf8');

// 1. Add mounted state at top of CheckoutClient
if (!content.includes('const [isMounted, setIsMounted] = useState(false);')) {
  content = content.replace(
    '  const { items: cart, getTotalPrice, clearCart, coupon, setCoupon, customShipping } = useCartStore();',
    `  const { items: cart, getTotalPrice, clearCart, coupon, setCoupon, customShipping } = useCartStore();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);`
  );
}

// 2. Add empty cart and mounting guard right before return (
const guardBlock = `  if (!isMounted) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <div className="w-12 h-12 border-4 border-red-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-stone-600 font-medium text-sm">A carregar os detalhes da sua encomenda...</p>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16 text-center">
        <div className="bg-white rounded-3xl p-8 sm:p-12 shadow-xl border border-stone-200/80 relative overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-72 h-32 bg-red-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="w-20 h-20 mx-auto rounded-2xl bg-amber-50 border border-amber-200 text-amber-600 flex items-center justify-center mb-6 shadow-sm">
            <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
          </div>

          <span className="inline-block px-3 py-1 rounded-full text-xs font-bold tracking-wider uppercase bg-amber-100 text-amber-900 border border-amber-300 mb-3">
            Acesso Condicionado ao Carrinho
          </span>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 mb-3 tracking-tight">
            O seu carrinho de compras está vazio
          </h1>

          <p className="text-stone-600 text-base max-w-lg mx-auto leading-relaxed mb-8">
            Para aceder à página de finalização de encomenda (Checkout), é obrigatório ter 
            <strong className="text-stone-900 font-semibold"> pelo menos um produto adicionado ao seu carrinho</strong>. 
            Consulte a nossa gama de produtos ou utilize o simulador de frete.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 max-w-md mx-auto">
            <Link
              href="/shop"
              className="w-full sm:w-auto flex-1 inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl shadow-lg shadow-red-600/25 transition-all text-sm group"
            >
              <span>Ver Catálogo na Loja</span>
              <svg className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </Link>

            <Link
              href="/#simulador-envio"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3.5 bg-stone-900 hover:bg-stone-800 text-white font-semibold rounded-xl transition text-sm"
            >
              <span>🚚 Simulador de Frete</span>
            </Link>
          </div>

          <div className="mt-8 pt-6 border-t border-stone-100 text-xs text-stone-700 flex items-center justify-center gap-2">
            <span>Precisa de apoio para encomendar?</span>
            <Link href="/contactos" className="text-red-600 font-semibold hover:underline">
              Contactar Apoio ao Cliente
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (`;

if (!content.includes('if (cart.length === 0)')) {
  content = content.replace('  return (', guardBlock);
}

// 3. Add Company & NIF fields in Billing Details
const billingTarget = `          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t('first_name')} <span className="text-red-500">*</span></label>
              <input type="text" name="firstName" required className="w-full px-4 py-2 border border-gray-200 bg-gray-50 rounded focus:ring-orange-500 focus:border-orange-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t('last_name')} <span className="text-red-500">*</span></label>
              <input type="text" name="lastName" required className="w-full px-4 py-2 border border-gray-200 bg-gray-50 rounded focus:ring-orange-500 focus:border-orange-500" />
            </div>
          </div>`;

const billingWithCompany = `          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t('first_name')} <span className="text-red-500">*</span></label>
              <input type="text" name="firstName" required className="w-full px-4 py-2 border border-gray-200 bg-gray-50 rounded focus:ring-orange-500 focus:border-orange-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t('last_name')} <span className="text-red-500">*</span></label>
              <input type="text" name="lastName" required className="w-full px-4 py-2 border border-gray-200 bg-gray-50 rounded focus:ring-orange-500 focus:border-orange-500" />
            </div>
          </div>

          {/* Dados de Empresa & NIF / NIPC para faturação comercial */}
          <div className="bg-stone-50/80 p-4 rounded-xl border border-stone-200/80 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-stone-700 flex items-center gap-1.5">
                <span>🏢</span> Dados para Faturação Empresarial (Opcional)
              </span>
              <span className="text-[11px] text-stone-700 bg-stone-200/70 px-2 py-0.5 rounded font-medium">
                Empresas & ENI
              </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nome da Empresa / Razão Social
                </label>
                <input 
                  type="text" 
                  name="companyName" 
                  placeholder="Ex: Silva & Filhos Lda" 
                  className="w-full px-4 py-2 border border-gray-200 bg-white rounded focus:ring-red-500 focus:border-red-500 text-sm" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  NIF / NIPC (Portugal ou Int.)
                </label>
                <input 
                  type="text" 
                  name="nif" 
                  placeholder="Ex: 501 234 567" 
                  maxLength={25}
                  className="w-full px-4 py-2 border border-gray-200 bg-white rounded focus:ring-red-500 focus:border-red-500 text-sm font-mono" 
                />
              </div>
            </div>
          </div>`;

// Normalize and replace
const hasCRLF = content.includes('\r\n');
const normTarget = hasCRLF ? billingTarget.replace(/\n/g, '\r\n') : billingTarget.replace(/\r\n/g, '\n');
const normWithComp = hasCRLF ? billingWithCompany.replace(/\n/g, '\r\n') : billingWithCompany.replace(/\r\n/g, '\n');

if (content.includes(normTarget)) {
  content = content.replace(normTarget, normWithComp);
} else {
  console.error('Could not find billingTarget');
  process.exit(1);
}

// 4. In shipping: make shippingCompany optional
content = content.replace(
  `<label className="block text-sm font-medium text-gray-700 mb-1">{t('company_name')} <span className="text-red-500">*</span></label>
                <input type="text" name="shippingCompany" required className="w-full px-4 py-2 border border-gray-200 bg-gray-50 rounded focus:ring-orange-500 focus:border-orange-500" />`,
  `<label className="block text-sm font-medium text-gray-700 mb-1">{t('company_name')}</label>
                <input type="text" name="shippingCompany" className="w-full px-4 py-2 border border-gray-200 bg-gray-50 rounded focus:ring-orange-500 focus:border-orange-500" />`
);

fs.writeFileSync(filePath, content, 'utf8');
console.log('Successfully updated CheckoutClient.tsx');

