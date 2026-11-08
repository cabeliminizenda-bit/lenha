const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'src', 'components', 'admin', 'settings', 'FooterForm.tsx');
let content = fs.readFileSync(filePath, 'utf8');

const target = `            <button type="button" onClick={() => setFooterColumns([...footerColumns, {title: '', links: []}])} className="text-sm text-blue-600 font-medium hover:underline flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
              {tSettings('add_new_column') || 'Add New Column'}
            </button>
          </div>
        </div>
      </div>

      <div className="pt-4 border-t border-gray-200">`;

const replacement = `            <button type="button" onClick={() => setFooterColumns([...footerColumns, {title: '', links: []}])} className="text-sm text-blue-600 font-medium hover:underline flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
              {tSettings('add_new_column') || 'Add New Column'}
            </button>
          </div>
        </div>

        {/* Section Copyright */}
        <div className="pt-6 border-t border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            {tSettings('copyright_section') || 'Texto de Copyright & Barra Inferior'}
          </h3>
          <div className="space-y-2 max-w-2xl">
            <label className="block text-sm font-medium text-gray-700">
              {tSettings('copyright_label') || 'Texto de Copyright'}
            </label>
            <input 
              type="text" 
              value={footerCopyright} 
              onChange={(e) => setFooterCopyright(e.target.value)} 
              placeholder="© 2026 Lenha & Carvão Silva Dias. Todos os direitos reservados."
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm font-medium text-gray-800 shadow-sm"
            />
            <p className="text-xs text-gray-500">
              Este texto é apresentado na barra inferior do rodapé em todas as páginas públicas da loja.
            </p>
          </div>
        </div>
      </div>

      <div className="pt-4 border-t border-gray-200">`;

const hasCRLF = content.includes('\r\n');
const normTarget = hasCRLF ? target.replace(/\n/g, '\r\n') : target.replace(/\r\n/g, '\n');
const normReplacement = hasCRLF ? replacement.replace(/\n/g, '\r\n') : replacement.replace(/\r\n/g, '\n');

if (content.includes(normTarget)) {
  content = content.replace(normTarget, normReplacement);
  fs.writeFileSync(filePath, content, 'utf8');
  console.log('Successfully added copyright field to FooterForm.tsx');
} else {
  console.error('Target not found in FooterForm.tsx');
  process.exit(1);
}

