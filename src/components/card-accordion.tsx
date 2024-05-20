import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "./ui/accordion";

interface CardAccordionProps {
    title?: string;
    subTitle?: string;
    children?: React.ReactNode;
    itemValue: string;
    size?: 'small' | 'medium' | 'large';
    expanded?: boolean;
}

export default function CardAccordion(props: CardAccordionProps) {

 function getTextSize(): string {
    switch (props.size) {
      case 'small':
        return 'text-sm';
      case 'medium':
        return 'text-base';
      case 'large':
        return 'text-lg';
      default:
        return 'text-base';
    }
 }

  return (
        <Accordion type="single" collapsible className="w-full border rounded-md px-3" defaultValue={props.expanded ? props.itemValue : ''}>
        <AccordionItem value={props.itemValue} style={{border: 'none'}}>
          <AccordionTrigger className='transition-all hover:px-2'>
            <div className="flex justify-between items-center w-full mr-4 px-2">
              <h3 className={getTextSize()}>{props.title}</h3>
              <div className="">{props.subTitle}</div>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <div className='p-5'>
                {props.children}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    )
}