module.exports = {
  Informational: {
    Continue: {
      code: 100,
      codeText: "100",
      description: "Continue",
    },
    switchingProtocols: {
      code: 101,
      codeText: "101",
      description: "Switching Protocols",
    },
    processing: {
      code: 102,
      codeText: "102",
      description: "Processing",
    },
    earlyHints: {
      code: 103,
      codeText: "103",
      description: "Early Hints",
    },
  },
  Success: {
    ok: {
      code: 200,
      codeText: "200",
      description: "OK",
    },
    created: {
      code: 201,
      codeText: "201",
      description: "Created",
    },
    accepted: {
      code: 202,
      codeText: "202",
      description: "Accepted",
    },
    nonAuthoritativeInformation: {
      code: 203,
      codeText: "203",
      description: "Non-Authoritative Information",
    },
    noContent: {
      code: 204,
      codeText: "204",
      description: "No Content",
    },
    noOuCode: {
      code: 212,
      codeText: "212",
      description: "This is organzation code not found",
    },
    noSusDoc: {
      code: 204,
      codeText: "204",
      description: "Sub document type not found ",
    },
    resetContent: {
      code: 205,
      codeText: "205",
      description: "Reset Content",
    },
    partialContent: {
      code: 206,
      codeText: "206",
      description: "Partial Content",
    },
    multiStatus: {
      code: 207,
      codeText: "207",
      description: "Multi-Status",
    },
    alreadyReported: {
      code: 208,
      codeText: "208",
      description: "Already Reported",
    },
    imUsed: {
      code: 226,
      codeText: "226",
      description: " IM Used",
    },
  },
  Redirection: {
    multipleChoices: {
      code: 300,
      codeText: "300",
      description: "Multiple Choices",
    },
    movedPermanently: {
      code: 301,
      codeText: "301",
      description: "Moved Permanently",
    },
    found: {
      code: 302,
      codeText: "302",
      description: 'Found (Previously "Moved temporarily")',
    },
    seeOther: {
      code: 303,
      codeText: "303",
      description: "See Other (since HTTP/1.1)",
    },
    notModified: {
      code: 304,
      codeText: "304",
      description: "Not Modified (RFC 7232)",
    },
    useProxy: {
      code: 305,
      codeText: "305",
      description: "Use Proxy (since HTTP/1.1)",
    },
    switchProxy: {
      code: 306,
      codeText: "306",
      description: "Switch Proxy",
    },
    temporaryRedirect: {
      code: 307,
      codeText: "307",
      description: "Temporary Redirect (since HTTP/1.1)",
    },
    permanentRedirect: {
      code: 308,
      codeText: "308",
      description: "Permanent Redirect (RFC 7538)",
    },
  },
  ClientErrors: {
    badRequest: {
      code: 400,
      codeText: "400",
      description: "Bad Request",
    },
    unauthorized: {
      code: 401,
      codeText: "401",
      description: "Unauthorized",
    },
    paymentRequired: {
      code: 402,
      codeText: "402",
      description: "Payment Required",
    },
    forbidden: {
      code: 403,
      codeText: "403",
      description: "Forbidden",
    },
    notFound: {
      code: 404,
      codeText: "404",
      description: "Not Found",
    },
    methodNotAllowed: {
      code: 405,
      codeText: "405",
      description: "Method Not Allowed",
    },
    notAcceptable: {
      code: 406,
      codeText: "406",
      description: "Not Acceptable",
    },
    proxyAuthenticationRequired: {
      code: 407,
      codeText: "407",
      description: "Proxy Authentication Required",
    },
    requestTimeout: {
      code: 408,
      codeText: "408",
      description: "Request Timeout",
    },
  },
  Fail: {
    err: {
      code: 500,
      codeText: "500",
      description: "ERROR",
    },
    notImplemented: {
      code: 501,
      codeText: "501",
      description: "Not Implemented",
    },
    badGateway: {
      code: 502,
      codeText: "502",
      description: "Bad Gateway",
    },
    serviceUnavailable: {
      code: 503,
      codeText: "503",
      description: "Service Unavailable",
    },
    gatewayTimeout: {
      code: 504,
      codeText: "504",
      description: "Gateway Timeout",
    },
    httpVersionNotSupported: {
      code: 505,
      codeText: "505",
      description: "HTTP Version Not Supported",
    },
    variantAlsoNegotiates: {
      code: 506,
      codeText: "506",
      description: " Variant Also Negotiates",
    },
    insufficientStorage: {
      code: 507,
      codeText: "507",
      description: "Insufficient Storage ",
    },
    loopDetected: {
      code: 508,
      codeText: "508",
      description: " Loop Detected",
    },
    notExtended: {
      code: 510,
      codeText: "510",
      description: "Not Extended",
    },
    networkAuthenticationRequired: {
      code: 511,
      codeText: "511",
      description: "Network Authentication Required",
    },
    fail: {
      code: 202,
      codeText: "202",
      description: "Data Not Found",
    },
  },
  unauthorized: {
    fail: {
      code: 400,
      codeText: "400",
      description: "Unauthorized",
    },
  },
  withdraw: {
    serverError: {
      statusCode: "500",
      statusText: "internal server error",
    },
    success: {
      statusCode: "200",
      statusText: "success",
    },
    noContent: {
      statusCode: "202",
      statusText: "no content",
    },
    balanceLessAmount: {
      statusCode: "205",
      statusText: "cbal less than amount",
    },
    insertWithTransactionFail: {
      statusCode: "207",
      statusText: "Insert withdraw transaction fail",
    },
    insertWalletTransactionFail: {
      statusCode: "209",
      statusText: "Insert wallet transaction fail",
    },
    updateMainWalletFail: {
      statusCode: "211",
      statusText: "Update main wallet fail",
    },
    insertDataSuccess: {
      statusCode: "200",
      statusText: "Insert data success",
    },
    findDataSuccess: {
      statusCode: "200",
      statusText: "Find data success",
    },
    findDataNotFound: {
      statusCode: "203",
      statusText: "find data not found",
    },
    updateDataSuccess: {
      statusCode: "200",
      statusText: "update data success",
    },
    updateDataFail: {
      statusCode: "203",
      statusText: "update data fail",
    },
    updateTransactionFail: {
      statusCode: "206",
      statusText: "update transaction fail",
    },
    findWalletMainFail: {
      statusCode: "202",
      statusText: "find wallet main fail",
    },
    findDocNotFound: {
      statusCode: "213",
      statusText: "find document type not found",
    },
    memberLock: {
      statusCode: "215",
      statusText: "Member status is lock",
    },
    memberExpired: {
      statusCode: "217",
      statusText: "Member status is expired",
    },
    memberNotNormal: {
      statusCode: "219",
      statusText: "Member status is not normal",
    },
    findMemberNotFound: {
      statusCode: "221",
      statusText: "Find member not found",
    },
    findStatusNotFound: {
      statusCode: "223",
      statusText: "Find status not found",
    },
    approved: {
      statusCode: "225",
      statusText: "This item has been approved",
    },
    rejected: {
      statusCode: "227",
      statusText: "This item has been reject",
    },
    criticalUpdateWithdraw: {
      statusCode: "303",
      statusText: "Critical lv 1. Update withdraw transaction fail",
    },
    criticalUpdateWallet: {
      statusCode: "403",
      statusText:
        "Critical lv 2. Update withdraw transaction or insert wallet transaction fail",
    },
    criticalRejectInsertWalletFail: {
      statusCode: "305",
      statusText: "Critical reject lv 1. insert wallet transaction fail",
    },
    criticalRejectUpdateTransactionFail: {
      statusCode: "405",
      statusText:
        "Critical reject lv 2. insert wallet transaction fail or update wallet main fail",
    },
  },
  deposit: {
    updateDepositSuccess: {
      code: 230,
      codeText: "230",
      description: "Update deposit is successfully.",
    },
    updateDepositFail: {
      code: 231,
      codeText: "231",
      description: "Update deposit is failed.",
    },
    getDepositTransitionSuccess: {
      code: 230,
      codeText: "230",
      description: "Show deposit is successfully.",
    },
    getDepositTransitionFail: {
      code: 231,
      codeText: "231",
      description: "Show deposit is failed.",
    },
    insertDepositTransitionSuccess: {
      code: 230,
      codeText: "230",
      description: "Add deposit is successfully.",
    },
    insertDepositTransitionFail: {
      code: 231,
      codeText: "231",
      description: "Add deposit is failed.",
    },
    insertWalletTransitionSuccess: {
      code: 230,
      codeText: "230",
      description: "Add wallet transaction is successfully.",
    },
    insertWalletTransitionFail: {
      code: 231,
      codeText: "231",
      description: "Add wallet transaction is failed.",
    },
    updateStatusDepositSuccess: {
      code: 230,
      codeText: "230",
      description: "Update deposit status is successfully.",
    },
    updateStatusDepositFail: {
      code: 231,
      codeText: "231",
      description: "Update deposit status is failed.",
    },
    updateWalletBalanceSuccess: {
      code: 230,
      codeText: "230",
      description: "Update balance wallet main is successfully.",
    },
    updateWalletBalanceFail: {
      code: 231,
      codeText: "231",
      description: "Update balance wallet main is failed.",
    },
    findWalletSuccess: {
      code: 230,
      codeText: "230",
      description: "Find wallet main is successfully.",
    },
    findWalletFail: {
      code: 231,
      codeText: "231",
      description: "Find wallet main is failed.",
    },
    FindUpdateStatusDepositSuccess: {
      code: 230,
      codeText: "230",
      description: "Deposit status not Approved or Rejected yet.",
    },
    FindUpdateStatusDepositFail: {
      code: 231,
      codeText: "231",
      description: "Deposit status Approved or Rejected done.",
    },
    queueDepositSuccess: {
      code: 230,
      codeText: "230",
      description: "Make a transitions done.",
    },
    queueDepositFail: {
      code: 231,
      codeText: "231",
      description: "Can't make a transitions this times.",
    },
  },
  doc_tpye: {
    serverError: {
      statusCode: "500",
      statusText: "Internal server error",
    },
    findDataSuccess: {
      statusCode: "200",
      statusText: "Find data success",
    },
    findDataNotFound: {
      statusCode: "203",
      statusText: "Find data not found",
    },
    insertDataSuccess: {
      statusCode: "200",
      statusText: "Insert Data success",
    },
    insertDataFail: {
      statusCode: "205",
      statusText: "Insert Data fail",
    },
    updateDataSuccess: {
      statusCode: "200",
      statusText: "Update data success",
    },
    updateDataFail: {
      statusCode: "207",
      statusText: "Update data fail",
    },
    documentRepeatInsert: {
      statusCode: "209",
      statusText: "Insert data duplicate",
    },
    documentRepeatUpdate: {
      statusCode: "209",
      statusText: "Update data duplicate",
    },
  },
  member: {
    telrep: {
      statusCode: "203",
      statusText: "Telephone repeat",
    },
  },
  memberSeach: {
    telready: {
      statusCode: "303",
      statusText: "Telephone is already exists",
    },
    emailready: {
      statusCode: "304",
      statusText: "Email is already exists",
    },
    membersucess: {
      statusCode: "200",
      statusText: "Register Sucess",
    },
    memberfail: {
      statusCode: "500",
      statusText: "Error Register member",
    },
  },
};
