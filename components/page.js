import Footer from '../components/footer'
import Section from '../components/section'

const Page = (props) => {
  return(
    <div>
      <Section>
        {props.children}
      </Section>
      <Footer />
    </div>
  )
}

export default Page
