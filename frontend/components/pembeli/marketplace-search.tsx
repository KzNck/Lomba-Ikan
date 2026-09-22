import Form from 'next/form'
import { Icon } from '@/components/ui/icon'

type MarketplaceSearchProps = {
  action: string
  label: string
  placeholder: string
  // What was searched, so the box keeps it.
  query: string
  // The rest of the view (sort, map pick, filters), so a new search keeps it.
  hidden: [string, string][]
}

// "Search". A GET form: submitting puts the text in ?q= and the page filters the batches on the server.
// Focus turns the grey border blue and adds the design's outer ring ("Focus Ring Search").
export function MarketplaceSearch({ action, label, placeholder, query, hidden }: MarketplaceSearchProps) {
  return (
    <Form
      action={action}
      scroll={false}
      role="search"
      className="box-border order-1 basis-full lg:order-none lg:basis-0 [flex:1_1_0] h-[48px] flex flex-row gap-[10px] p-[0px_16px] justify-start items-center bg-[#FFFFFF] [outline:1px_solid_#7F8FA4] [outline-offset:-0.5px] rounded-[12px] focus-within:[outline-color:#0F6CB8] focus-within:[box-shadow:0px_0px_0px_3px_#FFFFFF,_0px_0px_0px_5px_#0F6CB8]"
    >
      {hidden.map(([name, value], index) => (
        <input key={`${name}-${index}`} type="hidden" name={name} value={value} />
      ))}
      <Icon name="search" fill="#5B6B7C" className="box-border w-[20px] shrink-0 h-[20px]" />
      <label htmlFor="marketplace-search" className="sr-only">
        {label}
      </label>
      {/* Keyed by the search, so the box follows the URL when "Reset filter" or back/forward changes it. */}
      <input
        key={query}
        id="marketplace-search"
        type="search"
        name="q"
        defaultValue={query}
        placeholder={placeholder}
        autoComplete="off"
        className="text-[16px]/[normal] lg:text-[15px]/[normal] box-border [flex:1_1_0] min-w-0 self-stretch lg:self-auto bg-transparent text-[#0B3B5C] placeholder:text-[#5B6B7C] font-inter font-normal text-left outline-hidden"
      />
    </Form>
  )
}
