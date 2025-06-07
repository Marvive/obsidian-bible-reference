import { BibleReferencePluginSettings } from '../data/constants'
import { VerseSuggesting } from '../verse/VerseSuggesting'
import { BOOK_REG } from './regs'
import { getBibleVersion } from '../data/BibleVersionCollection'

/**
 * Get suggestions from string query
 * @param queryWithoutPrefix without the prefix trigger
 * @param settings
 */
export const getSuggestionsFromQuery = async (
  queryWithoutPrefix: string,
  settings: BibleReferencePluginSettings,
  translation?: string
): Promise<VerseSuggesting[]> => {
  console.debug(
    'get suggestion for query ',
    queryWithoutPrefix.toLowerCase(),
    translation,
    settings.bibleVersion,
    settings.defaultBibleVersion
  )

  const bookNameMatchingResults = queryWithoutPrefix.match(BOOK_REG)
  const rawBookName = bookNameMatchingResults?.length
    ? bookNameMatchingResults[0]
    : undefined

  if (!rawBookName) {
    console.error(`could not find through query`, queryWithoutPrefix)
    return []
  }

  const numbersPartsOfQueryString = queryWithoutPrefix.substring(
    rawBookName.length
  )
  const numbers = numbersPartsOfQueryString.split(/[-:]+/)

  const chapterNumber = parseInt(numbers[0].trim())
  const verseNumber = parseInt(numbers[1])
  const verseEndNumber = numbers.length === 3 ? parseInt(numbers[2]) : undefined

  const selectedBibleVersion = getBibleVersion(
    translation ? translation : settings.bibleVersion
  )

  // todo get bibleVersion and language from settings
  const suggestingVerse = new VerseSuggesting(
    settings,
    rawBookName,
    chapterNumber,
    verseNumber,
    verseEndNumber
  )

  console.debug(
    rawBookName,
    chapterNumber,
    verseNumber,
    verseEndNumber,
    suggestingVerse,
    settings
  )
  await suggestingVerse.fetchAndSetVersesText()
  return [suggestingVerse]
}
