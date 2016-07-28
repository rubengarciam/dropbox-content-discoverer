var nlp = require('nlp_compromise')

const fileTypesMapping = {
  'pdf': 'pdf',
  'pptx': 'pptx',
  'docx': 'docx',
  'xlsx': 'xlsx',
  'excel': 'xlsx',
  'presentation': 'pptx',
  'powerpoint': 'pptx',
  'word document': 'docx',
  'pdf document': 'pdf',
  'spreadsheet': 'xlsx'
}

let preFilters = {}
let postFilters = {}

function stripInfo (terms, infoType) {
  return terms.filter(function (t) {
    return !t.pos[infoType]
  })
}

function stripMeaninglessTerms (terms) {
  let meaninglessTerms = ['create', 'share', 'file', 'modify']
  return terms.filter(function (t) {
    return meaninglessTerms.indexOf(t.root()) < 0
  })
}

function extractInfo (terms, infoType) {
  // Do not parse the terms if it's the only term
  if (terms.length === 1) {
    return terms
  }
  var dates = terms.filter(function (t) {
    return t.pos[infoType]
  })
  if (dates.length > 0) {
    postFilters[infoType] = dates[0].root()
  }
  return terms.filter(function (t) {
    return !t.pos[infoType]
  })
}

function extractDate (terms) {
  return extractInfo(terms, 'Date')
}

function extractPerson (terms) {
  return extractInfo(terms, 'Person')
}

function extractFileTypes (terms) {
  // Do not parse the terms if it's the only term
  if (terms.length === 1) {
    return terms
  }
  preFilters['fileTypes'] = preFilters['fileTypes'].concat(terms.filter(function (t) {
    return fileTypesMapping[t.root()]
  }).map(function (t) {
    return fileTypesMapping[t.root()]
  }))
  return terms.filter(function (t) {
    return !fileTypesMapping[t.root()]
  })
}

function combineTerms (terms) {
  return terms.reduce(function (s, t) {
    s += ' ' + t.normal
    return s
  }, '').trim()
}

function extractFileTypesByWord (input) {
  preFilters['fileTypes'] = [];
  var terms = input.split(" ").map(function (t) {
    return nlp.noun(t)
  })
  terms = extractFileTypes(terms)
  return combineTerms(terms)
}

function nlpInspect (input) {
  preFilters = {}
  postFilters = {}
  let resultQuery
  let beginQuote = input.indexOf('"')
  let endQuote = input.lastIndexOf('"')
  if (beginQuote >= 0 && beginQuote < endQuote) {
    // If the input has quoted string, then extract it as searchContent
    let metaInfo = input.substring(0, beginQuote) + input.substring(endQuote + 1)
    let searchContent = input.substring(beginQuote + 1, endQuote)
    // Extract meta info to filters
    metaInfo = extractFileTypesByWord(metaInfo)
    var metaTerms = nlp.sentence(metaInfo).terms
    extractPerson(extractDate(extractFileTypes(metaTerms)))
    resultQuery = '[' + searchContent + ']'
    return searchContent
  } else {
    input = extractFileTypesByWord(input)
    var terms = nlp.sentence(input).terms
    var essentialTerms = stripInfo(stripInfo(stripInfo(terms, 'Preposition'), 'Determiner'), 'Conjunction')
    essentialTerms = stripMeaninglessTerms(essentialTerms)
    essentialTerms = extractFileTypes(essentialTerms)
    essentialTerms = extractPerson(extractDate(essentialTerms))
    var result = combineTerms(essentialTerms)
    resultQuery = '[' + result + ']'
    return {
      input: result,
      pre: preFilters,
      post: postFilters
    }
  }
}

module.exports = {nlpInspect, fileTypesMapping}
