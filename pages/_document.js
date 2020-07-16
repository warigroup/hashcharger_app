import Document, { Html, Head, Main, NextScript } from "next/document";
import { Fragment } from "react";
import { googleAnalytics, facebookPixel } from '../settings';

class MyDocument extends Document {
  static async getInitialProps(ctx) {
    const initialProps = await Document.getInitialProps(ctx);
    return { ...initialProps };
  }

  // Inject Google tags to page
  setGoogleTags() {
    return {
      __html: `
        window.dataLayer = window.dataLayer || []; 
        function gtag(){dataLayer.push(arguments);} 
        gtag('js', new Date()); 
        gtag('config', 'UA-142386975-2'); 
        gtag('config', 'AW-693268366');
      `
    };
  }

  render() {
    return (
      <Html
        lang="en"
        dir="ltr"
      >
        <Head>
          <meta charSet="utf-8" />
          <meta httpEquiv="X-Frame-Options" content="allow" />
          <meta httpEquiv="X-UA-Compatible" content="IE=edge,chrome=1" />
          <meta httpEquiv="Content-Language" content="en-US" />
          <meta httpEquiv="Content-Type" content="text/html; charset=utf-8" />
          <meta
            name="viewport"
            content="width=device-width, initial-scale=1, shrink-to-fit=no, user-scalable=no"
          />
          
          <meta name="description" content="" />
          <meta name="keywords" content="" />
          <meta name="author" content="" />

          {googleAnalytics === "on" ? 
          <Fragment>
          <script dangerouslySetInnerHTML={{
              __html: `(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
                (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
                m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
                })(window,document,'script','https://www.google-analytics.com/analytics.js','ga');
                
                ga('create', 'UA-142386975-2', 'auto');
                ga('send', 'pageview');`
            }} />
          </Fragment> : null}

          <meta
            name="format-detection"
            content="telephone=no,email=no,address=no"
          />
          <meta name="format-detection" content="email=no" />
          <meta name="format-detection" content="address=no" />
          <meta name="format-detection" content="telephone=no" />
          <link
            rel="apple-touch-icon"
            sizes="180x180"
            href="/static/apple-touch-icon.png"
          />
          <link
            rel="icon"
            type="image/png"
            sizes="32x32"
            href="/static/favicon-32x32.png"
          />
          <link
            rel="icon"
            type="image/png"
            sizes="16x16"
            href="/static/favicon-16x16.png"
          />
          <link rel="shortcut icon" href="/static/favicon.ico" />
          <link rel="manifest" href="/static/site.webmanifest" />
          <link
            rel="mask-icon"
            href="/static/safari-pinned-tab.svg"
            color="#5bbad5"
          />
          <meta
            itemProp="image"
            content="https://alpha.warihash.com/static/apple-touch-icon.png"
          />
          <meta name="msapplication-TileColor" content="#00aba9" />
          <meta name="theme-color" content="#ffffff" />
          <meta name="application-name" content="WariHash" />

          <script
            type="text/javascript"
            src="https://cdnjs.cloudflare.com/ajax/libs/babel-polyfill/6.20.0/polyfill.min.js"
          />
          
          <link
            rel="stylesheet"
            href="https://cdnjs.cloudflare.com/ajax/libs/normalize/8.0.1/normalize.min.css"
          />
          
          <link 
            rel="stylesheet" 
            href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css" 
            integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T" 
            crossOrigin="anonymous"
          />

          <link
            href="https://fonts.googleapis.com/css?family=Open+Sans:400,600&display=swap&subset=latin-ext"
            rel="stylesheet"
          />

          <link rel="stylesheet" href="/static/style.css" />
          <link rel="stylesheet" href="/static/pretty-checkbox.css" />
          <link rel="manifest" href="/static/manifest.json" />
          <meta name="theme-color" content="#ffffff" />
          <meta name="mobile-web-app-capable" content="yes" />
          <meta name="apple-mobile-web-app-title" content="WariHash" />
          <meta name="apple-mobile-web-app-capable" content="yes" />


          {/*** FACEBOOK PIXEL SCRIPTS ***/}
          {facebookPixel === "on" ? 
          <React.Fragment> 
          <script dangerouslySetInnerHTML={{ __html: `!function(f,b,e,v,n,t,s)
                  {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
                  n.callMethod.apply(n,arguments):n.queue.push(arguments)};
                  if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
                  n.queue=[];t=b.createElement(e);t.async=!0;
                  t.src=v;s=b.getElementsByTagName(e)[0];
                  s.parentNode.insertBefore(t,s)}(window,document,'script',
                  'https://connect.facebook.net/en_US/fbevents.js');
                  fbq('init', '258749781771770'); 
                  fbq('track', 'PageView');` }}
            />
            <noscript dangerouslySetInnerHTML={{ __html: `<img height="1" width="1" style="display:none"
              src="https://www.facebook.com/tr?id=258749781771770&ev=PageView
              &noscript=1" />` }}
            />
            </React.Fragment> :
            null
          }
          
          <script type="text/javascript" src="/static/disabledev.js" />
          {/* <script type="text/javascript" src="/static/HackTimer.min.js" /> */}
        </Head>
        <body>
          <Main />
          <NextScript />
             {/* Activate Google Analytics if its value is "on" */}
             {googleAnalytics === "on" ? (
            <Fragment>
              <script
                async
                src="https://www.googletagmanager.com/gtag/js?id=UA-142386975-2"
              />
              
              {/***  GOOGLE ADS ***/}
              <script 
                async 
                src="https://www.googletagmanager.com/gtag/js?id=AW-693268366" 
              />
              <script dangerouslySetInnerHTML={this.setGoogleTags()} />



            </Fragment>
          ) : null}
        <script id="ze-snippet" 
        src="https://static.zdassets.com/ekr/snippet.js?key=44bfd989-efb4-4dfd-a622-dd6724a11755">
        </script>
        </body>
      </Html>
    );
  }
}

export default MyDocument;
