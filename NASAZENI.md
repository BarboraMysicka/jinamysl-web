# Nasazení webu jiná mysl na GitHub Pages

Web je hotový Astro projekt. Kód je připravený a **lokálně zacommitovaný** v git.
Zbývá ho nahrát na GitHub a zapnout Pages. Přihlašování dělá vždy člověk (Barbora).

## 1. Nahrát na GitHub (nejsnazší: GitHub Desktop)

1. Otevři **GitHub Desktop** → `File → Add Local Repository` → vyber složku
   `~/Downloads/jinamysl-web`.
2. Vpravo nahoře **Publish repository**. Název třeba `jinamysl-web`.
   Můžeš dát **Private** i Public, Pages funguje u obou.
3. Hotovo, kód je na GitHubu.

(Alternativa přes příkazovou řádku, když máš nastavené přihlášení:
`git remote add origin https://github.com/<účet>/jinamysl-web.git`
`git branch -M main`
`git push -u origin main`)

## 2. Zapnout GitHub Pages

V repozitáři na githubu: **Settings → Pages → Build and deployment →
Source: „GitHub Actions"**. Nic víc, workflow už je v repu
(`.github/workflows/deploy.yml`). Po prvním pushi se web sám sestaví a nasadí.

## 3. Nasměrovat doménu jinamysl.cz (v administraci Forpsi)

Doména i e-mail zůstávají u Forpsi. Měníme jen záznamy pro web, **ne MX (e-mail)**.

U domény jinamysl.cz nastav:
- **A** záznamy (apex, tj. `@`), čtyři kusy:
  `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`
- **AAAA** (IPv6, volitelné): `2606:50c0:8000::153`, `2606:50c0:8001::153`,
  `2606:50c0:8002::153`, `2606:50c0:8003::153`
- **CNAME** pro `www` → `<účet>.github.io`
- **MX a e-mailové záznamy nech beze změny.**

Soubor `public/CNAME` (obsahuje `jinamysl.cz`) už je v repu, GitHub díky němu
custom doménu pozná. HTTPS certifikát GitHub vystaví sám (do pár hodin).

## 4. Co je hotové a co bude následovat

Hotové: celý web (tmavý „zvenčí" + světlý příběh „zblízka"), rychlost, SEO, favicon.

Následuje (další krok): **editor obsahu na `/admin`** (Decap CMS) pro přidávání
projektů a členek týmu bez kódu. Nastaví se, až repo existuje (potřebuje
napojení na GitHub + malou přihlašovací službu).

## Vývoj lokálně
```
npm install      # jednou
npm run dev      # náhled na http://localhost:4321
npm run build    # sestavení do dist/
```
