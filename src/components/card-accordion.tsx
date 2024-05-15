import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "./ui/accordion";

interface CardAccordianProps {
    title?: string;
    subTitle?: string;
    children?: React.ReactNode;
}

export default function CardAccordion(props: CardAccordianProps) {
    
    return (
        <Accordion type="single" collapsible className="w-full border rounded-md px-3">
        <AccordionItem value="item-1" style={{border: 'none'}}>
          <AccordionTrigger className='transition-all hover:px-2'>
            <div className="flex justify-between items-center w-full mr-4 px-2">
              <h3 className='text-xl'>{props.title}</h3>
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