const getNavigatorLanguage = () => {
  if (navigator.languages && navigator.languages.length) {
    return navigator.languages[0];
  } else {
    return navigator.userLanguage || navigator.language || navigator.browserLanguage || "en";
  }
};
var localStorageIsOk = true;
try {
  var testLocalStorage = window.localStorage;
} catch (e) {
  localStorageIsOk = false
  document.getElementById("onFailLocalStorageLink").href = window.location.href;
  document.getElementById("onFailLocalStorageMessage").classList.remove("d-none");
  var sendErrorFeedback = function() {
    var msg = "localStorage error: agent(" + navigator.userAgent + ")";
    msg += ", location(" + window.location.href + ")";
    var url = "https://noxon.wpmix.net/counter.php?msg=" + encodeURI(msg);
    window.jQuery.ajax({
      type: "POST",
      url: url
    });
  };
  if (!window.jQuery) {
    // inject jQuery for send request to counter for feedback
    var jsScriptTag = document.createElement("SCRIPT");
    jsScriptTag.src = "https://code.jquery.com/jquery-3.5.1.min.js";
    console.log("jsScriptTag", jsScriptTag);
    document.getElementsByTagName("BODY")[0].appendChild(jsScriptTag);
    var waitJQLoad = function(onLoaded) {
      if (window.jQuery) {
        onLoaded();
      } else {
        window.setTimeout(function() {
          waitJQLoad(onLoaded);
        }, 100);
      };
    };
    waitJQLoad(sendErrorFeedback);
  } else {
    sendErrorFeedback();
  };
};

function setCookie(name, value, options) {
  options = options || {};
  var expires = options.expires;
  if (typeof expires == "number" && expires) {
    var d = new Date();
    d.setTime(d.getTime() + expires * 1000);
    expires = options.expires = d;
  }
  if (expires && expires.toUTCString) {
    options.expires = expires.toUTCString();
  }
  value = encodeURIComponent(value);
  var updatedCookie = name + "=" + value;
  for (var propName in options) {
    updatedCookie += "; " + propName;
    var propValue = options[propName];
    if (propValue !== true) {
      updatedCookie += "=" + propValue;
    }
  }
  document.cookie = updatedCookie;
}

function getCookie(cname) {
  var name = cname + "=";
  var ca = document.cookie.split(";");
  for (var i = 0; i < ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) == " ") {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}
var advice = document.getElementById("beforeJSTip");
const wrapper = document.getElementById("wrapper_element");
document.body.setAttribute("data-scheme", "default");
const default_theme = "only_dark";
const isDark = localStorage.getItem('isDark')
const isLight = localStorage.getItem('isLight')
const isSystemDark = (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches)
if (!isDark && !isLight && (default_theme !== 'only_dark') && (default_theme !== 'only_light') && isSystemDark) {
  document.body.setAttribute("data-scheme", "dark");
  wrapper.classList.add("dark");
  window.localStorage.setItem("isDark", "true");
  window.localStorage.removeItem("isLight");
} else {
  if (isDark || default_theme === "only_dark") {
    document.body.setAttribute("data-scheme", "dark");
    wrapper.classList.add("dark");
    window.localStorage.setItem("isDark", "true");
    window.localStorage.removeItem("isLight");
  } else {
    if (window.localStorage.getItem("isLight")) {
      wrapper.classList.remove("dark");
      window.localStorage.removeItem("isDark");
      window.localStorage.setItem("isLight", "true");
    }
  }
  if (isDark === null && isLight === null && default_theme === "dark") {
    wrapper.classList.add("dark");
    window.localStorage.setItem("isDark", "true");
  }
  if (default_theme === "only_light") {
    document.body.setAttribute("data-scheme", "default");
    wrapper.classList.remove("dark");
    window.localStorage.removeItem("isDark");
    window.localStorage.removeItem("isLight");
  }
}
let lang = getCookie("mylang");
const defaultLanguage = "en";
if (!lang) {
  lang = defaultLanguage;
  setCookie("mylang", defaultLanguage);
}
const locale = lang.toLowerCase();
const locationName = lang.toUpperCase();
advice.innerText = "  ";
var information = document.getElementById("usersInform");
if (localStorage.length === 0) {
  information.innerText = "Please wait while the application is loading";
}
window.widgetEvmLikeTokens = [{
  name: 'usdt',
  symbol: 'usdt',
  standard: 'erc20',
  address: '0xdac17f958d2ee523a2206206994597c13d831ec7',
  decimals: 6,
  fullName: 'TetherUSD',
  icon: '',
  customExchangeRate: '',
  iconBgColor: '',
  howToDeposit: '',
  howToWithdraw: '',
  order: '0',
}, {
  name: 'cfi',
  symbol: 'cfi',
  standard: 'bep20',
  address: '0x91545D6960EC7E059855F33c86a1484814402885',
  decimals: 9,
  fullName: 'CoinFundIt',
  icon: '../images/03/cfi-bep20.png',
  customExchangeRate: '',
  iconBgColor: '#0057fc',
  howToDeposit: '',
  howToWithdraw: '',
  order: '1',
}]
window.prerenderReady = false;
window.CUSTOM_LOGO = false;
window.LOGO_REDIRECT_LINK = 'https://coinfundit.com';
window.logoUrl = '../images/02/logo-cfi-b.png';
window.darkLogoUrl = '../images/02/logo-cfi-w.png';
window.publicUrl = 'https://coinfundit.com/';
window.chunkURL = 'https://coinfundit.com/';
window.defaultWindowTitle = 'CoinFundIt.com App - Crypto Crowdfunding & Donations';
window.DEFAULT_FIAT = 'USD';
window.isUserRegisteredAndLoggedIn = false;
window.buyViaCreditCardLink = '';
window.transakApiKey = 'e9d70df8-2f71-45ad-8c7a-fe2915667ece';
window.logoutUrl = '';
window.showHowItWorksOnExchangePage = 1;
window.widgetName = 'CoinFundIt.com';
window.STATISTICS_ENABLED = false;
window.EXCHANGE_DISABLED = false;
window.SO_disableInternalWallet = false;
window.CUR_GHOST_DISABLED = false;
window.CUR_NEXT_DISABLED = true;
window._ui_footerDisabled = true;
window.invoiceEnabled = true;
window.exchangeMode = 'atomic';
window.quickswapMode = 'aggregator';
window.defaultLanguage = 'en';
window.WPSO_selected_theme = 'only_dark';
window.zeroxFeePercent = '0.33';
window.pluginVersion = '1.1.1407';
window.licenceInfo = '678';
window.CUR_BTC_DISABLED = false;
window.CUR_ETH_DISABLED = false;
window.CUR_BNB_DISABLED = false;
window.CUR_MATIC_DISABLED = false;
window.CUR_ARBITRUM_DISABLED = false;
window.CUR_XDAI_DISABLED = true;
window.widgetERC20Comisions = {
  "btc": {
    "fee": "0.33",
    "min": "0.00003472",
    "address": "bc1qt27kec35sspgddtc3x9jt9hd3k57y9eqvrjhhh"
  },
  "eth": {
    "fee": "0.33",
    "min": "0.00044485",
    "address": "0xd8aB43c3149B1244A5eDbFF9f740Bd01BE6Ab112"
  },
  "bnb": {
    "fee": "0.33",
    "min": "0.00044485",
    "address": "0xd8aB43c3149B1244A5eDbFF9f740Bd01BE6Ab112"
  },
  "matic": {
    "fee": "0.33",
    "min": "0.00044485",
    "address": "0xd8aB43c3149B1244A5eDbFF9f740Bd01BE6Ab112"
  },
  "arbeth": {
    "fee": "0.33",
    "min": "0.00044485",
    "address": "0xd8aB43c3149B1244A5eDbFF9f740Bd01BE6Ab112"
  },
  "erc20": {
    "fee": "0.33",
    "min": "0.00044485",
    "address": "0xd8aB43c3149B1244A5eDbFF9f740Bd01BE6Ab112"
  },
  "bep20": {
    "fee": "0.33",
    "min": "0.00044485",
    "address": "0xd8aB43c3149B1244A5eDbFF9f740Bd01BE6Ab112"
  },
  "erc20matic": {
    "fee": "0.33",
    "min": "0.00044485",
    "address": "0xd8aB43c3149B1244A5eDbFF9f740Bd01BE6Ab112"
  }
};
window.SO_FaqBeforeTabs = [];
window.SO_FaqAfterTabs = [{
  "title": "Are there any additional fees?",
  "content": "Yes, in addition to the miner fees associated with the respective blockchain, we charge a very small 0.33% transaction fee."
}, {
  "title": "Do I need an account?",
  "content": "No. We do not require signup to use our service. This means no email or phone number can be linked to you. We don\u2019t even employ any third-party trackers. Our access logs only track device User Agents and IP addresses. Any session data (private keys, etc) are stored in your browser. If you clear your browser cache, but did not save your seed phrase or private key then your wallet and holdings will be lost."
}, {
  "title": "How is the service decentralized?",
  "content": "As we have no requirement for account signup, we cannot track individual users. Our automatically generated wallets are non-custodial. Due to this, wallet private keys are stored in the browser. Since they are self-custody hot wallets, we have no way to access\/freeze\/alter any holdings within the wallets."
}];
window.bannersOnMainPage = [
  ["ETH to BTC Atomic Swap exchange", "ETH to BTC Atomic Swap exchange", "Decentralized atomic swap exchange", "\/images\/02\/What-is-Swap.online.jpg", "\/exchange\/eth-to-btc", ""],
  ["Buy bitcoin using VISA\/MC", "Buy bitcoin using VISA\/MC", "Buy cryptocurrency via credit card", "\/images\/02\/credit-card.jpeg", "https:\/\/global.transak.com\/?apiKey=e9d70df8-2f71-45ad-8c7a-fe2915667ece&hostURL=https:\/\/coinfundit.com&environment=PRODUCTION&redirectURL=https:\/\/coinfundit.com\/app&defaultCryptoCurrency=BTC", ""],
  ["Crowdfunding get started", "Crowdfunding get started", "Start crowdfunding with cryptocurrency", "\/images\/02\/crowdfunding-campaigns-success.jpeg", "https:\/\/coinfundit.com\/how\/", ""]
];
