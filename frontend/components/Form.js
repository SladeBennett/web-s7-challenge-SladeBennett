import React, { useEffect, useState } from 'react'
import * as yup from 'yup'


const validationErrors = {
  fullNameTooShort: 'full name must be at least 3 characters',
  fullNameTooLong: 'full name must be at most 20 characters',
  sizeIncorrect: 'size must be S or M or L'
}

// 👇 Here you will create your schema.
const leSchema = yup.object().shape({
  fullName: yup.string().trim()
    .min(3, validationErrors.fullNameTooShort).max(20, validationErrors.fullNameTooLong),

  size: yup.string().trim()
    .oneOf(['small', 'medium', 'large'], validationErrors.sizeIncorrect)
})

const toppings = [
  { topping_id: '1', text: 'Pepperoni' },
  { topping_id: '2', text: 'Green Peppers' },
  { topping_id: '3', text: 'Pineapple' },
  { topping_id: '4', text: 'Mushrooms' },
  { topping_id: '5', text: 'Ham' },
]


const initialValues = () => ({
  fullName: '',
  size: '',
  toppings: []
})
const initialErrors = () => ({
  fullName: '',
  size: ''
})


export default function Form() {
  const [values, setValues] = useState(initialValues())
  const [errors, setErrors] = useState(initialErrors())
  const [enabled, setEnabled] = useState(false)
  const [formSuccess, setFormSuccess] = useState()
  const [formFailure, setFormFailure] = useState()

  useEffect(() => {
    leSchema.isValid(values).then(setEnabled)
  }, [values])

  const onChange = evt => {
    let { name, value } = evt.target
    setValues({ ...values, [name]: value })
    yup
      .reach(leSchema, name)
      .validate(value)
      .then(() => {
        setErrors({ ...errors, [name]: "" })
      })
      .catch((err) => {
        setErrors({ ...errors, [name]: err.errors[0] })
      })
  }

  const onSubmit = evt => {
    evt.preventDefault()
    setFormSuccess(true)
    setFormFailure(false)
  }
  const successText = `Thank you for your order, ${values.fullName}! Your ${values.size} pizza is on its way.`
  return (
    <form onSubmit={onSubmit}>
      <h2>Order Your Pizza</h2>
      {formSuccess && <div className='success'>{successText}</div>}
      {formFailure && <div className='failure'>Something went wrong</div>}

      <div className="input-group">
        <div>
          <label htmlFor="fullName">Full Name</label><br />
          <input value={values.fullName} placeholder="Type full name" id="fullName" name="fullName" type="text" onChange={onChange} />
        </div>
        {errors.fullName && <div className='error'>{errors.fullName}</div>}
      </div>

      <div className="input-group">
        <div>
          <label htmlFor="size">Size</label><br />
          <select value={values.size} id="size" name="size" onChange={onChange}>
            <option value="">----Choose Size----</option>
            <option value="small">Small</option>
            <option value="medium">Medium</option>
            <option value="large">Large</option>
          </select>
        </div>
        {errors.size && <div className='error'>{errors.size}</div>}
      </div>

      <div className="input-group">
        {toppings.map((item) => {
          return (
            <label key={item.topping_id}>
              <input
                name={item.topping_id}
                type="checkbox"
                onChange={onChange}
              />
              {item.text}<br />
            </label>
          )
        })}
      </div>
      <input disabled={!enabled} type="submit" />
    </form>
  )
}
