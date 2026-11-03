// Gathers every string for this language. Each file maps to one
// part of the site; the key on the left is what code passes to useT('<name>').
import common from './common'
import seo from './seo'
import home from './home'
import whatIsAI from './whatIsAI'
import tokenizer from './tokenizer.jsx'
import embeddings from './embeddings.jsx'
import attention from './attention.jsx'
import run from './run.jsx'
import about from './about'
import resources from './resources'

export default { common, seo, home, whatIsAI, tokenizer, embeddings, attention, run, about, resources }
