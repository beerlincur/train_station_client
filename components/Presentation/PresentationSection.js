import st from "./PresentationSection.module.css";
import cx from 'classnames';

export const PresentationSectionItem = props => {
  return (
    <div className={cx(st.items, {[st.dark]: props.dark}, props.className)} style={props.styles}>
      {props.children}
    </div>
  )
}

const PresentationSection = props => {
  return (
    <section className={st.section}>
      <h2 className={st.subtitle}>{props.title}</h2>
      {props.children}
    </section>
  )
}

export default PresentationSection
