import React, { PropsWithChildren, useEffect, useState } from 'react'

import classNames from 'classnames'

import styles from './styles.module.scss'

type Props = {
  disabled?: boolean
  checked?: boolean
  label?: string
  id?: string
  onChange: (value: boolean) => void
}
export default function Switch({ ...props }: PropsWithChildren<Props>) {
  const [checked, setChecked] = useState(props.checked)

  useEffect(() => {
    setChecked(props.checked)
  }, [props.checked])

  const toggle = (event: React.ChangeEvent<HTMLInputElement>) => {
    const v = event.target.checked
    console.log('Switch toggle clicked:', {
      newValue: v,
      currentChecked: checked,
      propsChecked: props.checked,
      disabled: props.disabled,
    })
    props.onChange(v)
    setChecked(v)
  }

  return (
    <div className={styles.switchWrapper}>
      <input
        id={props.id}
        type='checkbox'
        disabled={props.disabled}
        onChange={toggle}
        checked={checked}
        aria-label={props.label}
      />
      <span
        className={classNames(styles.switchIndicator, {
          [styles.switchIndicatorOn]: checked,
          [styles.disabled]: props.disabled,
        })}
      ></span>
    </div>
  )
}
