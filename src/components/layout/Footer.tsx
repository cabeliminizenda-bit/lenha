"use client";
import Image from 'next/image';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import NewsletterFooterForm from './NewsletterFooterForm';

type FooterProps = {
  supportPhone?: string;
  supportEmail?: string;
  footerBgColor?: string;
  footerTextColor?: string;
  footerHeadingColor?: string;
  footerAddress1?: string;
  footerAddress2?: string;
  footerLocationsTitle?: string;
  footerNewsletterTitle?: string;
  footerNewsletterText?: string;
  footerNewsletterPlaceholder?: string;
  footerCallUsText?: string;
  footerCopyright?: string;
  footerSocialFacebook?: string;
  footerSocialTwitter?: string;
  footerSocialInstagram?: string;
  footerSocialLinkedin?: string;
  footerColumns?: Array<{ title: string, links: Array<{ label: string, url: string }> }>;
  categories?: Array<{ id: string, name: string, slug: string | null }>;
  footerLogoImage?: string;
  footerDescription?: string;
  footerShowAddress?: boolean;
  footerShowEmail?: boolean;
  footerShowPhone?: boolean;
  footerPaymentAmex?: boolean;
  footerPaymentApplePay?: boolean;
  footerPaymentGooglePay?: boolean;
  footerPaymentMastercard?: boolean;
  footerPaymentVisa?: boolean;
  footerPaymentOpay?: boolean;
  contactSlug?: string;
};

export default function Footer({ 
  supportPhone = '+351 253 000 000', 
  supportEmail = 'cabeliminizenda@gmail.com',
  footerBgColor = '#1C1917',
  footerTextColor = '#ffffff',
  footerHeadingColor = '#ffffff',
  footerAddress1 = 'Portugal Continental & Ilhas',
  footerAddress2 = '',
  footerLocationsTitle = 'Informações',
  footerNewsletterTitle = 'A Nossa Newsletter',
  footerNewsletterText = 'Subscreva para receber ofertas exclusivas e conselhos úteis sobre aquecimento a biomassa.',
  footerNewsletterPlaceholder = 'O seu endereço de e-mail...',
  footerCallUsText = 'Apoio Telefónico',
  footerCopyright = '© 2026 Lenha & Carvão Silva Dias. Todos os direitos reservados.',
  footerSocialFacebook = '#',
  footerSocialTwitter = '#',
  footerSocialInstagram = '#',
  footerSocialLinkedin = '#',
  footerColumns = [],
  categories = [],
  footerLogoImage = '',
  footerDescription = 'Especialistas em biomassa, pellets certificados ENplus A1, lenha seca e equipamentos térmicos de alta eficiência (salamandras, recuperadores de calor e climatização) com entregas em Portugal Continental.',
  footerShowAddress = true,
  footerShowEmail = true,
  footerShowPhone = true,
  footerPaymentAmex = true,
  footerPaymentApplePay = true,
  footerPaymentGooglePay = true,
  footerPaymentMastercard = true,
  footerPaymentVisa = true,
  footerPaymentOpay = true,
  contactSlug = 'contact'
}: FooterProps) {
  const t = useTranslations('Footer');

  return (
    <footer 
      className="font-sans pt-16 pb-12 relative" 
      style={{ backgroundColor: footerBgColor, color: footerTextColor }}
    >
      <div className="max-w-[1400px] mx-auto px-6 w-full">
        
        {/* Top Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 mb-16">
          
          {/* Column 1: Info */}
          <div className="lg:col-span-1">
            <div className="mb-6 flex items-center">
              {footerLogoImage ? (
                <Image src={footerLogoImage} alt="Footer Logo" width={200} height={48} className="max-h-12 w-auto object-contain" />
              ) : (
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-red-600 to-red-700 flex items-center justify-center text-white shadow-md">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C9.5 6 7 8 7 12c0 2.8 2.2 5 5 5s5-2.2 5-5c0-4-2.5-6-5-10zm0 13c-1.7 0-3-1.3-3-3 0-1.7 1.1-2.9 2-4.5.9 1.6 2 2.8 2 4.5 0 1.7-1.3 3-3 3z"/></svg>
                  </div>
                  <div>
                    <span className="font-extrabold text-base tracking-tight text-white block leading-tight">LENHA &amp; CARVÃO</span>
                    <span className="text-[10px] font-bold tracking-wider text-red-500 uppercase block">SILVA DIAS</span>
                  </div>
                </div>
              )}
            </div>
            
            <p className="text-sm mb-8 leading-relaxed opacity-90">
              {footerDescription}
            </p>
            
            <div className="space-y-4 text-sm opacity-90">
              {footerShowAddress && footerAddress1 && (
                <div className="flex items-start">
                  <svg className="w-5 h-5 mr-3 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.243-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                  <p>{footerAddress1}</p>
                </div>
              )}
              {footerShowEmail && supportEmail && (
                <div className="flex items-start">
                  <svg className="w-5 h-5 mr-3 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                  <p>{supportEmail}</p>
                </div>
              )}
              {footerShowPhone && supportPhone && (
                <div className="flex items-start">
                  <svg className="w-5 h-5 mr-3 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                  <p>{supportPhone}</p>
                </div>
              )}
            </div>
          </div>

          {/* Dynamic Footer Columns from Admin (Replaces Col 2 & 3) */}
          {footerColumns && footerColumns.length > 0 ? (
            footerColumns.map((col, idx) => (
              <div key={idx} className="lg:col-span-1">
                <h3 className="font-bold text-lg mb-6" style={{ color: footerHeadingColor }}>{col.title}</h3>
                <ul className="space-y-4 text-sm opacity-90">
                  {col.links.map((link, linkIdx) => (
                    <li key={linkIdx}>
                      <Link href={link.url} className="hover:text-yellow-400 transition">
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))
          ) : (
            <>
              {/* Column 2: Informações Legais */}
              <div className="lg:col-span-1">
                <h3 className="font-bold text-lg mb-6" style={{ color: footerHeadingColor }}>Informações Legais</h3>
                <ul className="space-y-4 text-sm opacity-90">
                  <li><Link href="/devolucoes" className="hover:text-red-400 transition">Política de Devolução</Link></li>
                  <li><Link href="/expedicao" className="hover:text-red-400 transition">Expedição e Entrega</Link></li>
                  <li><Link href="/termos-e-condicoes" className="hover:text-red-400 transition">Termos e Condições</Link></li>
                  <li><Link href="/privacidade" className="hover:text-red-400 transition">Privacidade (RGPD)</Link></li>
                  <li><Link href={`/${contactSlug}`} className="hover:text-red-400 transition">Contacte-nos</Link></li>
                </ul>
              </div>

              {/* Column 3: A Minha Conta */}
              <div className="lg:col-span-1">
                <h3 className="font-bold text-lg mb-6" style={{ color: footerHeadingColor }}>A Minha Conta</h3>
                <ul className="space-y-4 text-sm opacity-90">
                  <li><Link href="/account" className="hover:text-red-400 transition">A Minha Conta</Link></li>
                  <li><Link href="/cart" className="hover:text-red-400 transition">Ver Carrinho</Link></li>
                  <li><Link href="/account/orders" className="hover:text-red-400 transition">As Minhas Encomendas</Link></li>
                  <li><Link href="/checkout" className="hover:text-red-400 transition">Finalizar Compra</Link></li>
                  <li><Link href="/#simulador-envio" className="hover:text-red-400 transition">Simulador de Envio</Link></li>
                </ul>
              </div>
              {/* Column 4: Categorias em Destaque */}
              <div className="lg:col-span-1">
                <h3 className="font-bold text-lg mb-6" style={{ color: footerHeadingColor }}>Categorias</h3>
                <ul className="space-y-4 text-sm uppercase opacity-90 tracking-wide">
                  {categories && categories.length > 0 ? (
                    categories.slice(0, 10).map((cat) => (
                      <li key={cat.id}>
                        <Link href={`/product-category/${cat.slug}`} className="hover:text-red-400 transition">
                          {cat.name}
                        </Link>
                      </li>
                    ))
                  ) : (
                    <>
                      <li><Link href="/product-category/pellets-e-lenha" className="hover:text-red-400 transition">Pellets &amp; Lenha</Link></li>
                      <li><Link href="/product-category/salamandras" className="hover:text-red-400 transition">Salamandras</Link></li>
                      <li><Link href="/product-category/recuperadores-de-calor" className="hover:text-red-400 transition">Recuperadores de Calor</Link></li>
                      <li><Link href="/product-category/fogoes" className="hover:text-red-400 transition">Fogões a Lenha</Link></li>
                      <li><Link href="/product-category/climatizacao" className="hover:text-red-400 transition">Climatização</Link></li>
                      <li><Link href="/product-category/termoacumuladores" className="hover:text-red-400 transition">Termoacumuladores</Link></li>
                    </>
                  )}
                </ul>
              </div>
            </>
          )}

          {/* Column 5: Newsletter */}
          <div className="lg:col-span-1">
            <h3 className="font-bold text-lg mb-6" style={{ color: footerHeadingColor }}>{footerNewsletterTitle}</h3>
            <p className="text-sm mb-6 leading-relaxed opacity-90">
              {footerNewsletterText}
            </p>
            <NewsletterFooterForm placeholder={footerNewsletterPlaceholder} />
          </div>

        </div>

        {/* Bottom Section */}
        <div className="border-t border-white/20 pt-8 mt-8 flex flex-col md:flex-row items-center justify-between">
          <div className="text-sm opacity-90 mb-4 md:mb-0">
            {footerCopyright}
          </div>
          <div className="flex items-center space-x-2">
            {footerPaymentAmex && (
              <div className="bg-white px-2 py-1 rounded text-blue-800 font-bold text-xs uppercase shadow-sm">Amex</div>
            )}
            {footerPaymentApplePay && (
              <div className="bg-white px-2 py-1 rounded text-black font-bold text-xs shadow-sm">Pay</div>
            )}
            {footerPaymentGooglePay && (
              <div className="bg-white px-2 py-1 rounded text-gray-700 font-bold text-xs shadow-sm">G Pay</div>
            )}
            {footerPaymentMastercard && (
              <div className="bg-white px-2 py-1 rounded text-red-600 font-bold text-xs shadow-sm">Master</div>
            )}
            {footerPaymentOpay && (
              <div className="bg-white px-2 py-1 rounded text-blue-600 font-bold text-xs shadow-sm">OPay</div>
            )}
            {footerPaymentVisa && (
              <div className="bg-white px-2 py-1 rounded text-blue-900 font-bold text-xs uppercase shadow-sm">Visa</div>
            )}
          </div>
        </div>

      </div>
    </footer>
  );
}
